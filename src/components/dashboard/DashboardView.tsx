import React from 'react';
import { MetricCards } from './MetricCards';
import { ChartsSection } from './ChartsSection';
import { RecentTransactionsSection } from './RecentTransactionsSection';
import { TopCategoriesSection } from './TopCategoriesSection';
import { UpcomingBillsSection } from './UpcomingBillsSection';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Four Financial Indicators */}
      <MetricCards />

      {/* 2. Interactive Main & Category Charts */}
      <ChartsSection />

      {/* 3. Recent Transactions, Top Categories & Upcoming Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Recent Transactions */}
        <div className="lg:col-span-7">
          <RecentTransactionsSection />
        </div>

        {/* Right Column (5 cols): Categories Budget & Upcoming Bills */}
        <div className="lg:col-span-5 space-y-6">
          <TopCategoriesSection />
          <UpcomingBillsSection />
        </div>
      </div>
    </div>
  );
};
