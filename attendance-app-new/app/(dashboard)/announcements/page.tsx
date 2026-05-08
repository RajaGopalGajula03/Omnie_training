"use client";

import {Alert,Box, Button,Chip,CircularProgress,MenuItem, Stack,TextField,Typography,} from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentPanel, MetricCard, PageIntro } from "../_components/dashboard-ui";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Announcement = {
  id: number;
  title: string;
  description: string;
  audience: "all" | "admin" | "employee";
  publish_date: string;
  is_active:boolean;
};

type AnnouncementForm = {
  title: string;
  description: string;
  audience: Announcement["audience"];
  publish_date: string;
  is_active:boolean;
};

const defaultForm: AnnouncementForm = {
  title: "",
  description: "",
  audience: "all",
  publish_date: new Date().toISOString().slice(0, 10),
  is_active:true,
};

export default function AnnouncementsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "company" | "targeted">("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createForm, setCreateForm] = useState<AnnouncementForm>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AnnouncementForm>(defaultForm);

  const isAdmin = user?.role === "Manager" || user?.role === "HR";

  const loadAnnouncements = async () => {
    const res = await fetch("/api/announcements", { credentials: "include" });
    const data = await res.json();
    setAnnouncements(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [authRes, announcementRes] = await Promise.all([
        fetch("/api/auth/check", { credentials: "include" }),
        fetch("/api/announcements", { credentials: "include" }),
      ]);

      if (!authRes.ok) {
        router.push("/login");
        return;
      }

      const authData = await authRes.json();
      const announcementData = await announcementRes.json();

      if (!active) {
        return;
      }

      setUser(authData.user);
      setAnnouncements(Array.isArray(announcementData) ? announcementData : []);
      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [router]);

  const filteredAnnouncements = useMemo(() => {
    if (activeFilter === "company") {
      return announcements.filter((item) => item.audience === "all");
    }

    if (activeFilter === "targeted") {
      return announcements.filter((item) => item.audience !== "all");
    }

    return announcements;
  }, [activeFilter, announcements]);

  const startEdit = (item: Announcement) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      audience: item.audience || "all",
      publish_date: item.publish_date || new Date().toISOString().slice(0, 10),
      is_active: item.is_active ?? true,
    });
  };

  const saveAnnouncement = async (id: number, payload: AnnouncementForm) => {
    const res = await fetch(`/api/announcements/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.message || "Unable to update announcement." });
      return;
    }

    await loadAnnouncements();
    setEditingId(null);
    setMessage({ type: "success", text: "Announcement updated." });
  };

  const createAnnouncement = async () => {
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(createForm),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.message || "Unable to create announcement." });
      return;
    }

    await loadAnnouncements();
    setCreateForm(defaultForm);
    setMessage({ type: "success", text: "Announcement created." });
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageIntro
        eyebrow="Announcements"
        title="Announcement management"
        description="Create, edit, and review internal announcements from one simple admin page."
      />

      {message ? (
        <Alert severity={message.type} sx={{ mb: 2.5 }}>
          {message.text}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2.2,
          mb: 6,
          alignItems: "stretch",
          "& > *": { height: "100%" },
        }}
      >
        <MetricCard
          label="Total Posts"
          value={announcements.length}
          icon={<CampaignOutlinedIcon />}
          hint="Show all announcements"
          color="#ede9fe"
          onClick={() => setActiveFilter("all")}
        />
        <MetricCard
          label="All Hands Notes"
          value={announcements.filter((item) => item.audience === "all").length}
          icon={<Diversity3OutlinedIcon />}
          hint="Visible to everyone"
          color="#dbeafe"
          onClick={() => setActiveFilter("company")}
        />
        <MetricCard
          label="Targeted Updates"
          value={announcements.filter((item) => item.audience !== "all").length}
          icon={<MarkEmailUnreadOutlinedIcon />}
          hint="Role specific notices"
          color="#ffedd5"
          onClick={() => setActiveFilter("targeted")}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(320px, 0.85fr) minmax(0, 1.15fr)" },
          gap: 2.4,
        }}
      >
        {isAdmin ? (
          <ContentPanel
            title="Create announcement"
            subtitle="Publish a new company-wide or targeted update."
          >
            <Stack spacing={1.4}>
              <TextField
                label="Title"
                value={createForm.title}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, title: event.target.value }))
                }
              />
              <TextField
                label="Description"
                multiline
                minRows={4}
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, description: event.target.value }))
                }
              />
              <TextField
                select
                label="Audience"
                value={createForm.audience}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    audience: event.target.value as Announcement["audience"],
                  }))
                }
              >
                {["all", "admin", "employee"].map((audience) => (
                  <MenuItem key={audience} value={audience}>
                    {audience}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                label="Date"
                value={createForm.publish_date}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, publish_date: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => void createAnnouncement()}
              >
                Create Announcement
              </Button>
            </Stack>
          </ContentPanel>
        ) : null}

        <ContentPanel
          title="Announcement feed"
          subtitle={
            activeFilter === "company"
              ? "Showing company-wide updates."
              : activeFilter === "targeted"
              ? "Showing targeted updates."
              : "Showing all announcements."
          }
          sx={!isAdmin ? undefined : { gridColumn: { xl: "2 / 3" } }}
        >
          <Stack spacing={1.4}>
            {filteredAnnouncements.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <Box
                  key={item.id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  {isEditing ? (
                    <Stack spacing={1.2}>
                      <TextField
                        label="Title"
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                      <TextField
                        label="Description"
                        multiline
                        minRows={3}
                        value={editForm.description}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                      />
                      <Stack direction={{ xs: "column", md: "row" }} spacing={1.2}>
                        <TextField
                          select
                          fullWidth
                          label="Audience"
                          value={editForm.audience}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              audience: event.target.value as Announcement["audience"],
                            }))
                          }
                        >
                          {["all", "admin", "employee"].map((audience) => (
                            <MenuItem key={audience} value={audience}>
                              {audience}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          type="date"
                          label="Date"
                          value={editForm.publish_date}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, publish_date: event.target.value }))
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Stack>
                    </Stack>
                  ) : (
                    <>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Typography sx={{ color: "#0f172a", fontWeight: 800, fontSize: 17 }}>
                          {item.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={item.audience} size="small" />
                          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>{item.publish_date}</Typography>
                        </Stack>
                      </Stack>
                      <Typography sx={{ mt: 1, color: "#64748b", lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                    </>
                  )}

                  {isAdmin ? (
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      {isEditing ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => void saveAnnouncement(item.id, editForm)}
                          >
                            Save
                          </Button>
                          <Button size="small" variant="text" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </Button>
                      )}
                    </Stack>
                  ) : null}
                </Box>
              );
            })}

            {filteredAnnouncements.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                No announcements found for the selected view.
              </Typography>
            ) : null}
          </Stack>
        </ContentPanel>
      </Box>
    </Box>
  );
}
