import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Mail, Users } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const sendPromotional = async (email) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });
    if (text) {
      try {
        const res = await axiosSecure.post(`/send-email`, {
          to: email,
          subject: "promotional",
          text: text,
        });
        if (res.data.success) {
          Swal.fire("Email sent successfully");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Could not send email",
          text: "The email service is not available right now. Please try again later.",
        });
      }
    }
  };

  return (
    <div>
      <h2 className="mb-5 text-center text-4xl font-bold text-primary">
        Manage Users ({userData?.length || 0})
      </h2>
      {isLoading ? (
        <p className="text-center text-lg text-muted-foreground">
          Loading users...
        </p>
      ) : !userData?.length ? (
        <div className="rounded-lg border border-border bg-background py-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            New users will appear here once they sign up.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10 py-2">#</TableHead>
                <TableHead className="h-10 py-2">User</TableHead>
                <TableHead className="h-10 py-2">Email</TableHead>
                <TableHead className="h-10 py-2">Role</TableHead>
                <TableHead className="h-10 py-2">Status</TableHead>
                <TableHead className="h-10 py-2 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user, idx) => (
                <TableRow key={user?._id}>
                  <TableCell className="py-2 tabular-nums text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user?.name || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">{user?.email}</TableCell>
                  <TableCell className="py-2 capitalize">
                    <Badge
                      variant={user?.role === "admin" ? "default" : "secondary"}
                    >
                      {user?.role || "user"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    {user?.isActive ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    {user?.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendPromotional(user?.email)}
                      >
                        <Mail className="mr-1 h-4 w-4" />
                        Send email
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
