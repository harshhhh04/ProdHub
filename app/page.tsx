'use client';

import React, { useState } from 'react';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { DeepWorkModal } from '@/components/deepwork/DeepWorkModal';
import { FridayReviewModal } from '@/components/review/FridayReviewModal';
import { SundayPlanningModal } from '@/components/review/SundayPlanningModal';

import { DashboardView } from '@/components/dashboard/DashboardView';
import { MissionsView } from '@/components/missions/MissionsView';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { KnowledgeView } from '@/components/knowledge/KnowledgeView';
import { InterviewView } from '@/components/interview/InterviewView';
import { PlacementView } from '@/components/placement/PlacementView';
import { ReadingView } from '@/components/reading/ReadingView';
import { HealthView } from '@/components/health/HealthView';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // Modals state
  const [isDeepWorkOpen, setIsDeepWorkOpen] = useState(false);
  const [isFridayReviewOpen, setIsFridayReviewOpen] = useState(false);
  const [isSundayPlanningOpen, setIsSundayPlanningOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Sticky Header */}
        <Header
          onOpenDeepWork={() => setIsDeepWorkOpen(true)}
          onOpenFridayReview={() => setIsFridayReviewOpen(true)}
          onOpenSundayPlanning={() => setIsSundayPlanningOpen(true)}
        />

        {/* Tab Views */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenDeepWork={() => setIsDeepWorkOpen(true)}
            />
          )}

          {activeTab === 'missions' && (
            <MissionsView onOpenDeepWork={() => setIsDeepWorkOpen(true)} />
          )}

          {activeTab === 'projects' && <ProjectsView />}

          {activeTab === 'knowledge' && <KnowledgeView />}

          {activeTab === 'interview' && <InterviewView />}

          {activeTab === 'placement' && <PlacementView />}

          {activeTab === 'reading' && <ReadingView />}

          {activeTab === 'health' && <HealthView />}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        setActiveTab={setActiveTab}
        onOpenDeepWork={() => setIsDeepWorkOpen(true)}
      />

      {/* Deep Work Timer Modal */}
      <DeepWorkModal
        isOpen={isDeepWorkOpen}
        onClose={() => setIsDeepWorkOpen(false)}
      />

      {/* Guided Review Modals */}
      <FridayReviewModal
        isOpen={isFridayReviewOpen}
        onClose={() => setIsFridayReviewOpen(false)}
      />

      <SundayPlanningModal
        isOpen={isSundayPlanningOpen}
        onClose={() => setIsSundayPlanningOpen(false)}
      />
    </div>
  );
}
