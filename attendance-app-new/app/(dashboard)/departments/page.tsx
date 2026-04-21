"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import { departments } from "@/lib/dashboard-data";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

export default function DepartmentsPage() {
  const totalMembers = departments.reduce((sum, item) => sum + item.members, 0);

  return (
    <Box>
      <PageIntro
        eyebrow="Departments"
        title="Department directory"
        description="A simple overview of the teams, team leads, and member distribution across your organization."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 3,
        }}
      >
        <MetricCard label="Departments" value={departments.length} icon={<DomainOutlinedIcon />} hint="Active teams" color="#dbeafe" />
        <MetricCard label="Team Leads" value={departments.length} icon={<SupervisorAccountOutlinedIcon />} hint="Department owners" color="#dcfce7" />
        <MetricCard label="Total Members" value={totalMembers} icon={<GroupsOutlinedIcon />} hint="Headcount across teams" color="#ffedd5" />
      </Box>

      <ContentPanel
        title="All departments"
        subtitle="Use this view to understand headcount and ownership across business units."
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {departments.map((department) => (
            <Box
              key={department.id}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                backgroundColor: "rgba(248,250,252,0.95)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ color: "#0f172a", fontWeight: 800, fontSize: 18 }}>
                  {department.name}
                </Typography>
                <Chip label={`${department.members} members`} />
              </Stack>
              <Typography sx={{ color: "#64748b", lineHeight: 1.7 }}>
                Lead: {department.lead}
              </Typography>
            </Box>
          ))}
        </Box>
      </ContentPanel>
    </Box>
  );
}
