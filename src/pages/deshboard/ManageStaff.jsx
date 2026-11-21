import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import formatDate from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { Trash, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const headerCellSx = { fontWeight: 600 };

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const ROLE_DESCRIPTIONS = {
  manager:
    "Can manage products, orders, suppliers and purchase orders, including deletes. Cannot manage staff or shop settings.",
  staff:
    "Can add and edit products, orders, suppliers and purchase orders. Cannot delete anything or manage staff.",
  viewer: "Can view everything, change nothing.",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const { shop, isShopOwner } = useShop();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [isAdding, setIsAdding] = useState(false);
  // Member waiting on remove confirmation (a MUI dialog, not
  // window.confirm — the confirm dialog must be clickable everywhere).
  const [removeTarget, setRemoveTarget] = useState(null);

  const {
    data: team,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staff", shop?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/shop/${shop._id}/members`);
      return res.data;
    },
    enabled: !!shop?._id && isShopOwner,
  });

  if (!shop?._id) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        You do not have a shop yet. Create one to manage its staff.
      </Typography>
    );
  }

  if (!isShopOwner) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        Only the shop owner can manage staff.
      </Typography>
    );
  }

  const handleAdd = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Enter an email address.");
      return;
    }
    setIsAdding(true);
    try {
      await axiosSecure.post(`/shop/${shop._id}/members`, {
        email: trimmedEmail,
        role,
      });
      toast.success("Staff member added.");
      setEmail("");
      setRole("staff");
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to add staff member."
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await axiosSecure.put(`/shop/${shop._id}/members/${memberId}`, {
        role: newRole,
      });
      toast.success("Role updated.");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update role.");
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      await axiosSecure.delete(
        `/shop/${shop._id}/members/${removeTarget._id}`
      );
      toast.success("Staff member removed.");
      setRemoveTarget(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove member.");
    }
  };

  const members = team?.members || [];

  return (
    <div>
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Manage Your Staff
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 1 }}
      >
        Staff members need a stockSculpt account first — ask them to sign up,
        then add them here by email. No invitation email is sent yet; once
        added, your shop appears in their dashboard when they sign in.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Add a staff member</Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 240 }}
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="staff-role-label">Role</InputLabel>
              <Select
                labelId="staff-role-label"
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={isAdding}
              endIcon={<UserPlus className="h-4 w-4" />}
              sx={{ height: 56 }}
            >
              {isAdding ? "Adding..." : "Add staff member"}
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {ROLE_DESCRIPTIONS[role]}
          </Typography>
        </CardContent>
      </Card>

      {isLoading ? (
        <Box sx={{ mt: 3, display: "grid", gap: 1 }}>
          <Skeleton variant="rounded" height={48} />
          <Skeleton variant="rounded" height={48} />
          <Skeleton variant="rounded" height={48} />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Name</TableCell>
                <TableCell sx={headerCellSx}>Email</TableCell>
                <TableCell sx={headerCellSx}>Role</TableCell>
                <TableCell sx={headerCellSx}>Added</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {team?.owner ? (
                <TableRow sx={zebraRowSx}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={team.owner.user?.avatar}
                        variant="rounded"
                        sx={{ width: 32, height: 32, fontSize: "0.75rem" }}
                      >
                        {getInitials(team.owner.user?.name)}
                      </Avatar>
                      {team.owner.user?.name || "—"}
                    </Box>
                  </TableCell>
                  <TableCell>{team.owner.user?.email || "—"}</TableCell>
                  <TableCell>
                    <Chip label="Owner" color="primary" size="small" />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {formatDate(team.owner.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
              {members.map((member) => (
                <TableRow key={member._id} sx={zebraRowSx}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={member.user?.avatar}
                        variant="rounded"
                        sx={{ width: 32, height: 32, fontSize: "0.75rem" }}
                      >
                        {getInitials(member.user?.name)}
                      </Avatar>
                      {member.user?.name || "—"}
                    </Box>
                  </TableCell>
                  <TableCell>{member.user?.email || "—"}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <Select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member._id, e.target.value)
                        }
                        aria-label={`Change role of ${member.user?.name || member.user?.email}`}
                        sx={{ fontSize: "0.8125rem" }}
                      >
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setRemoveTarget(member)}
                      aria-label={`Remove ${member.user?.name || member.user?.email}`}
                    >
                      <Trash className="h-4 w-4" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} sx={{ color: "text.secondary" }}>
                  {members.length + (team?.owner ? 1 : 0)} team member
                  {members.length + (team?.owner ? 1 : 0) === 1 ? "" : "s"}
                  {" · "}
                  {members.length} staff
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!removeTarget} onClose={() => setRemoveTarget(null)}>
        <DialogTitle>Remove staff member?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {removeTarget
              ? `${removeTarget.user?.name || removeTarget.user?.email} will lose access to ${shop.name}. Their account stays intact.`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setRemoveTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleRemove}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageStaff;
