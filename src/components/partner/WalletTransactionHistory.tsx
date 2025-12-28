import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { WalletTransaction } from '@/types';

interface WalletTransactionHistoryProps {
  transactions: WalletTransaction[];
}

export default function WalletTransactionHistory({ transactions }: WalletTransactionHistoryProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wallet Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Wallet Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {transactions.slice(0, 10).map((txn) => (
            <div key={txn.id} className="p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.transaction_type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    {txn.transaction_type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(txn.created_date), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    txn.transaction_type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {txn.transaction_type === 'credit' ? '+' : '-'}₹{txn.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Balance: ₹{txn.balance_after.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
