"use client";

import { Avatar, Box, ButtonBase, Paper, Stack, Typography, type SxProps, type Theme, } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import React from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "center" }}
      spacing={2}
      sx={{ mb: 3.5 }}
    >
      <Box>
        <Typography sx={{ color: "#94a3b8", fontSize: 13, fontWeight: 700, mb: 0.8 }}>
          {eyebrow}
        </Typography>
        <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, color: "#0f172a" }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 1, color: "#64748b", maxWidth: 720, lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}

export function MetricCard({ label, value, icon, hint, color, onClick, }:
  {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    hint: string;
    color: string;
    onClick?: () => void;
  }) {
  const content = (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 3,
        height: "100%",
        border: "1px solid rgba(15, 23, 42, 0.06)",
        background: "white",
        transition: "box-shadow 0.18s ease",
        "&:hover": onClick
          ? {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
          }
          : undefined,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography sx={{ color: "#64748b", fontSize: 14, fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          <Typography sx={{ color: "#0f172a", fontSize: 34, fontWeight: 800, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography sx={{ mt: 1.3, color: "#64748b", fontSize: 13 }}>{hint}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 50, height: 50, color: "#0f172a" }}>{icon}</Avatar>
      </Stack>
      {onClick ? (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2, color: "#2563eb" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>View all</Typography>
          <ArrowOutwardIcon sx={{ fontSize: 16 }} />
        </Stack>
      ) : null}
    </Paper>
  );

  return onClick ? (
    <ButtonBase
      onClick={onClick}
      sx={{ width: "100%", display: "block", borderRadius: 4, textAlign: "left" }}
    >
      {content}
    </ButtonBase>
  ) : (
    content
  );
}

export function ContentPanel({
  title,
  subtitle,
  children,
  sx,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, md: 2.75 },
        borderRadius: 3,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "white",
        ...sx,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ color: "#0f172a", fontSize: 19, fontWeight: 800 }}>{title}</Typography>
        {subtitle ? (
          <Typography sx={{ mt: 0.6, color: "#64748b", lineHeight: 1.6 }}>{subtitle}</Typography>
        ) : null}
      </Box>
      {children}
    </Paper>
  );
}

export function StatList({
  items,
}: {
  items: Array<{ label: string; value: string | number; accent?: string }>;
}) {
  return (
    <Stack spacing={1.2}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 1.4,
            py: 1.25,
            borderRadius: 2,
            backgroundColor: "#f8fafc",
          }}
        >
          <Typography sx={{ color: "#475569", fontWeight: 600 }}>{item.label}</Typography>
          <Typography sx={{ color: item.accent || "#0f172a", fontWeight: 800 }}>{item.value}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
