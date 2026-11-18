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
import { Mail, Store } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MenageShop = () => {
  const axiosSecure = useAxiosSecure();
  const { data: shops, isLoading } = useQuery({
    queryKey: ["all-shops"],
    queryFn: async () => {
      const res = await axiosSecure.get("/shop");
      return res.data;
    },
  });

  const sendNotice = async (email) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Notice",
      inputPlaceholder: "Type your notice here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });
    if (text) {
      try {
        const res = await axiosSecure.post(`/send-email`, {
          to: email,
          subject: "Notice from StockSculpt",
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
      <h2 className="text-center text-4xl font-bold text-primary">
        Manage Shops ({shops?.length || 0})
      </h2>
      <div className="mt-5">
        {isLoading ? (
          <p className="text-center text-lg text-muted-foreground">
            Loading shops...
          </p>
        ) : !shops?.length ? (
          <div className="rounded-lg border border-border bg-background py-12 text-center">
            <Store className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No shops found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Shops will appear here once owners create them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10 py-2">#</TableHead>
                  <TableHead className="h-10 py-2">Shop</TableHead>
                  <TableHead className="h-10 py-2">Owner</TableHead>
                  <TableHead className="h-10 py-2">Plan</TableHead>
                  <TableHead className="h-10 py-2 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop, idx) => (
                  <TableRow key={shop?._id}>
                    <TableCell className="py-2 tabular-nums text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg">
                          <AvatarImage
                            src={shop?.logo}
                            alt={shop?.name}
                            className="rounded-lg"
                          />
                          <AvatarFallback className="rounded-lg">
                            {shop?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{shop?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      {shop?.owner?.name || shop?.owner?.email || "—"}
                    </TableCell>
                    <TableCell className="py-2 capitalize">
                      <Badge
                        variant={
                          shop?.subscriptionPlan &&
                          shop.subscriptionPlan !== "free"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {shop?.subscriptionPlan || "free"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendNotice(shop.owner?.email)}
                        disabled={!shop.owner?.email}
                      >
                        <Mail className="mr-1 h-4 w-4" />
                        Send Notice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenageShop;
