"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import { announcements } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AnnouncementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const audience = searchParams.get("audience") ?? "all";
  const filteredAnnouncements = useMemo(() => {
    if (audience === "all") {
      return announcements;
    }

    if (audience === "company") {
      return announcements.filter((item) => item.audience === "all");
    }

    if (audience === "targeted") {
      return announcements.filter((item) => item.audience !== "all");
    }

    return announcements;
  }, [audience]);

  return (
    <Box>
      <PageIntro
        eyebrow="Announcements"
        title="Internal announcements"
        description="Keep everyone aligned with company updates, policy notes, reminders, and operational messages."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard label="Total Posts" value={announcements.length} icon={<CampaignOutlinedIcon />} hint="Published updates" color="#ede9fe" onClick={() => router.push("/announcements")} />
        <MetricCard label="All Hands Notes" value={announcements.filter((item) => item.audience === "all").length} icon={<Diversity3OutlinedIcon />} hint="Visible to everyone" color="#dbeafe" onClick={() => router.push("/announcements?audience=company")} />
        <MetricCard label="Targeted Updates" value={announcements.filter((item) => item.audience !== "all").length} icon={<MarkEmailUnreadOutlinedIcon />} hint="Role-specific updates" color="#ffedd5" onClick={() => router.push("/announcements?audience=targeted")} />
      </Box>

      <ContentPanel
        title="Announcement feed"
        subtitle={
          audience === "company"
            ? "Showing company-wide updates."
            : audience === "targeted"
            ? "Showing targeted updates."
            : "Recent updates sorted for quick scanning and communication."
        }
      >
        <Stack spacing={1.4}>
          {filteredAnnouncements.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                backgroundColor: "rgba(248,250,252,0.95)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                <Typography sx={{ color: "#0f172a", fontWeight: 800, fontSize: 17 }}>
                  {item.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={item.audience} size="small" />
                  <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>{item.date}</Typography>
                </Stack>
              </Stack>
              <Typography sx={{ mt: 1, color: "#64748b", lineHeight: 1.7 }}>
                {item.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </ContentPanel>
    </Box>
  );
}
