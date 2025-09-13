"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SEOAnalyzer } from './client-component';

export default function SEOPage() {
    return (
        <DashboardLayout>
            <SEOAnalyzer />
        </DashboardLayout>
    );
}
