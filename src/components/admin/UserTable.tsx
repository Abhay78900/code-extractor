import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  MoreHorizontal,
  User,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Report {
  id: string;
  full_name?: string;
  user_email?: string;
  pan_number?: string;
  mobile?: string;
  average_score?: number;
  view_count?: number;
  last_viewed_at?: string;
  created_date: string;
  is_high_risk?: boolean;
}

const getScoreBadge = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700' };
  if (score >= 650) return { label: 'Good', color: 'bg-teal-100 text-teal-700' };
  if (score >= 500) return { label: 'Average', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Poor', color: 'bg-red-100 text-red-700' };
};

interface UserTableProps {
  reports: Report[];
  onViewReport?: (report: Report) => void;
  onDownload?: (report: Report) => void;
}

export default function UserTable({ reports, onViewReport, onDownload }: UserTableProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-xl">
        <User className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>User</TableHead>
            <TableHead>PAN</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Last Viewed</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => {
            const scoreBadge = getScoreBadge(report.average_score || 0);

            return (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/30"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.full_name}</p>
                      <p className="text-sm text-muted-foreground">{report.user_email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{report.pan_number}</TableCell>
                <TableCell>{report.mobile}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{report.average_score}</span>
                    <Badge className={scoreBadge.color}>{scoreBadge.label}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{report.view_count || 1}</span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {report.last_viewed_at
                    ? format(new Date(report.last_viewed_at), 'MMM d, yyyy HH:mm')
                    : format(new Date(report.created_date), 'MMM d, yyyy HH:mm')
                  }
                </TableCell>
                <TableCell>
                  {report.is_high_risk ? (
                    <Badge className="bg-red-100 text-red-700 gap-1">
                      <AlertTriangle className="w-3 h-3" /> High
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700">Low</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewReport?.(report)}>
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload?.(report)}>
                        <Download className="w-4 h-4 mr-2" /> Download Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
