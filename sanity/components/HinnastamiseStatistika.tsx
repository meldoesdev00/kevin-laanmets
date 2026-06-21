import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { Card, Stack, Text, Flex, Spinner, Box, Heading } from "@sanity/ui";

type Stats = { visits: number; total: number; jah: number; ei: number };

function percent(n: number, total: number) {
  return total === 0 ? "0%" : `${Math.round((n / total) * 100)}%`;
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

export function HinnastamiseStatistika() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    client
      .fetch<Stats>(
        `{
          "visits": count(*[_type == "hinnastamiseKylastus"]),
          "total": count(*[_type == "hinnastamisParing"]),
          "jah": count(*[_type == "hinnastamisParing" && planToSell == "Jah"]),
          "ei": count(*[_type == "hinnastamisParing" && planToSell == "Ei"])
        }`
      )
      .then(setStats);
  }, [client]);

  if (!stats) {
    return (
      <Flex padding={5} justify="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Stack space={4}>
          <Heading size={1}>Lingi konversioon</Heading>
          <Flex gap={3} wrap="wrap">
            <StatCard label="Lingi klikid (/hinnastamine)" value={stats.visits} tone="primary" />
            <StatCard
              label="Jõudis JAH-ni"
              value={stats.jah}
              sub={`${percent(stats.jah, stats.visits)} klikkidest`}
              tone="positive"
            />
          </Flex>
        </Stack>

        <Stack space={4}>
          <Heading size={1}>Vormi täitnud päringud</Heading>
          <Flex gap={3} wrap="wrap">
            <StatCard label="Kokku päringuid" value={stats.total} tone="primary" />
            <StatCard
              label="Soovib müüa (JAH)"
              value={stats.jah}
              sub={percent(stats.jah, stats.total)}
              tone="positive"
            />
            <StatCard
              label="Ei plaani praegu (EI)"
              value={stats.ei}
              sub={percent(stats.ei, stats.total)}
              tone="caution"
            />
          </Flex>
        </Stack>
      </Stack>
    </Box>
  );
}
