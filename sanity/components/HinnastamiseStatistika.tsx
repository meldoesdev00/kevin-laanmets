import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Card, Stack, Text, Flex, Spinner, Box, Heading } from "@sanity/ui";

type RawData = {
  visits: { utmCampaign?: string }[];
  leads: { utmCampaign?: string; planToSell?: string }[];
};

type CampaignStat = { campaign: string; visits: number; jah: number; ei: number };

const NO_CAMPAIGN = "(otsene / teadmata)";

function percent(n: number, total: number) {
  return total === 0 ? "0%" : `${Math.round((n / total) * 100)}%`;
}

function groupByCampaign({ visits, leads }: RawData): CampaignStat[] {
  const map = new Map<string, CampaignStat>();
  const get = (campaign: string) => {
    if (!map.has(campaign)) map.set(campaign, { campaign, visits: 0, jah: 0, ei: 0 });
    return map.get(campaign)!;
  };

  for (const v of visits) {
    get(v.utmCampaign || NO_CAMPAIGN).visits += 1;
  }
  for (const l of leads) {
    const row = get(l.utmCampaign || NO_CAMPAIGN);
    if (l.planToSell === "Jah") row.jah += 1;
    else row.ei += 1;
  }

  return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
}

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub?: string;
  tone?: "positive" | "caution" | "primary";
}) {
  return (
    <Card padding={4} radius={3} tone={tone} border flex={1}>
      <Stack space={3}>
        <Text size={1} muted>
          {label}
        </Text>
        <Flex align="baseline" gap={2}>
          <Text size={6} weight="bold">
            {value}
          </Text>
          {sub && <Text size={2} muted>({sub})</Text>}
        </Flex>
      </Stack>
    </Card>
  );
}

function CampaignTable({ rows }: { rows: CampaignStat[] }) {
  if (rows.length === 0) {
    return (
      <Text size={1} muted>
        Andmeid veel pole.
      </Text>
    );
  }

  return (
    <Card radius={3} border style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--card-border-color, rgba(0,0,0,0.12))" }}>
            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Kampaania (utm_campaign)</th>
            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Lingi klikid</th>
            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Jõudis JAH-ni</th>
            <th style={{ padding: "10px 14px", fontWeight: 600 }}>Konversioon</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.campaign} style={{ borderBottom: "1px solid var(--card-border-color, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "10px 14px" }}>{r.campaign}</td>
              <td style={{ padding: "10px 14px" }}>{r.visits}</td>
              <td style={{ padding: "10px 14px" }}>{r.jah}</td>
              <td style={{ padding: "10px 14px" }}>{percent(r.jah, r.visits)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function HinnastamiseStatistika() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [data, setData] = useState<RawData | null>(null);

  useEffect(() => {
    client
      .fetch<RawData>(
        `{
          "visits": *[_type == "hinnastamiseKylastus"]{utmCampaign},
          "leads": *[_type == "hinnastamisParing"]{utmCampaign, planToSell}
        }`
      )
      .then(setData);
  }, [client]);

  if (!data) {
    return (
      <Flex padding={5} justify="center">
        <Spinner />
      </Flex>
    );
  }

  const visits = data.visits.length;
  const total = data.leads.length;
  const jah = data.leads.filter((l) => l.planToSell === "Jah").length;
  const ei = total - jah;
  const campaignRows = groupByCampaign(data);

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Stack space={4}>
          <Heading size={1}>Lingi konversioon</Heading>
          <Flex gap={3} wrap="wrap">
            <StatCard label="Lingi klikid (/hinnastamine)" value={visits} tone="primary" />
            <StatCard
              label="Jõudis JAH-ni"
              value={jah}
              sub={`${percent(jah, visits)} klikkidest`}
              tone="positive"
            />
          </Flex>
        </Stack>

        <Stack space={4}>
          <Heading size={1}>Vormi täitnud päringud</Heading>
          <Flex gap={3} wrap="wrap">
            <StatCard label="Kokku päringuid" value={total} tone="primary" />
            <StatCard label="Soovib müüa (JAH)" value={jah} sub={percent(jah, total)} tone="positive" />
            <StatCard label="Ei plaani praegu (EI)" value={ei} sub={percent(ei, total)} tone="caution" />
          </Flex>
        </Stack>

        <Stack space={4}>
          <Heading size={1}>Kampaaniate lõikes</Heading>
          <CampaignTable rows={campaignRows} />
        </Stack>
      </Stack>
    </Box>
  );
}
