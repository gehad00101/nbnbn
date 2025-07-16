
'use client';

import { ReactNode } from "react";
import { useBranch } from "@/context/BranchContext";
import { Spinner } from "./spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type BranchGuardProps = {
  children: (branchId: string) => ReactNode;
};

export function BranchGuard({ children }: BranchGuardProps) {
  const { selectedBranch, loading, branches } = useBranch();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!selectedBranch || branches.length === 0) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-100px)] p-4">
             <Card className="max-w-md text-center">
                 <CardHeader>
                     <CardTitle>الرجاء تحديد أو إنشاء فرع</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <p>
                         يجب عليك تحديد فرع لعرض هذه الصفحة. إذا لم يكن لديك أي فروع، يرجى إنشاء فرع جديد أولاً.
                     </p>
                     <Button asChild>
                         <Link href="/branches">الانتقال إلى صفحة الفروع</Link>
                     </Button>
                 </CardContent>
             </Card>
        </div>
    );
  }

  return <>{children(selectedBranch.id)}</>;
}
