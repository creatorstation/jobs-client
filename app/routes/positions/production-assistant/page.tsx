import type { Route } from './+types/page';
import { toast } from 'react-toastify';

import { SubmitForm } from '~/components/SubmitForm';
import { userStore } from '~/store/user-store';
import axios from 'axios';
import { useEffect } from 'react';
import { AuthButtons } from '~/components/AuthButtons';
import { appStore } from '~/store/app-store';
import { handleLinkedInAuth } from '~/helpers/handleLinkedInLogin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Production Assistant' },
    {
      name: 'description',
      content: 'Join CreatorStation as a Production Assistant and contribute to top Turkish YouTube channels!',
    },
  ];
}

export default function ProductionAssistant() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/production-assistant` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Production Assistant</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-700">
          At CreatorStation, we’re shaping the future of digital content! As a trailblazer in influencer marketing and
          talent management, we partner with Turkey’s top creators on YouTube, Instagram, and TikTok across
          entertainment, gaming, education, style, beauty, and travel. With over 50 million subscribers and 40 million
          unique viewers monthly, we produce dynamic, high-quality content that keeps audiences coming back for more. If
          you’re passionate about YouTube, Instagram, and TikTok, have an eye for beauty trends, and love bringing
          creative ideas to life, we’d love to have you on board. Explore our work on Instagram{' '}
          <a className="text-blue-500" href="https://crst.io/ig">
            @creatorstation
          </a>{' '}
          and YouTube{' '}
          <a className="text-blue-500" href="https://crst.io/yt">
            Youtuber Durağı
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Position</h2>
        <p className="text-gray-700">Production Assistant</p>
        <p className="text-gray-700">
          Location: This is a full-time, onsite role based at our Vadistanbul office on the European side of Istanbul.
          Candidates must reside on the European side of Istanbul.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Why Join Us?</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Work with top creators and household brands to produce content that makes an impact.</li>
          <li>Immerse yourself in a creative, fast-paced environment where no two days are the same.</li>
          <li>
            Contribute to projects that push the boundaries of digital storytelling across YouTube, Instagram, and
            TikTok.
          </li>
        </ul>
      </section>

      <div id="reqs">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">What We’re Looking For</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>
              Social Media Enthusiast: You actively follow creators and stay tuned to the latest trends on YouTube,
              Instagram, and TikTok.
            </li>
            <li>
              Beauty & Makeup Pro: You’re familiar with makeup, beauty products, and the latest trends in the industry.
            </li>
            <li>
              Reliable & Flexible: Available to work on-site in Istanbul, five days a week, with no domestic travel
              restrictions.
            </li>
            <li>
              Trend Savvy: You keep up with the latest on YouTube, Instagram, TikTok, and other social media platforms.
            </li>
            <li>Bilingual Advantage: Strong proficiency in English.</li>
            <li>Location-Specific Requirement: Residing on the European side of Istanbul is required.</li>
          </ul>
        </section>
      </div>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Role</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Plan & Organize: Manage video and social media content preparations, track timelines, and ensure seamless
            execution.
          </li>
          <li>
            Source & Manage Supplies: Handle procurement, returns, and organization of materials, including makeup and
            beauty products.
          </li>
          <li>Be the Go-To Person: Support creators and filming crews with everything they need to succeed.</li>
          <li>
            Ensure Flawless Content: Preview videos, test featured products (especially in beauty), and provide
            actionable feedback.
          </li>
          <li>
            Handle Logistics: Manage permits, expenses, and other organizational tasks for shoots across YouTube,
            Instagram, and TikTok.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What You Bring</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>A love for all things digital, creative, and beautiful.</li>
          <li>A proactive, problem-solving attitude and attention to detail.</li>
          <li>The ability to thrive in a fast-paced, collaborative environment.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ready to Make Your Mark?</h2>
        <p className="text-gray-700">
          Apply now to join CreatorStation’s Istanbul team and be part of shaping the next big thing in digital content
          creation. Let’s create something extraordinary together!
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Production Assistant" submitBtnText="Apply for Production Assistant" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="production-assistant" />
          </div>
        )}
      </div>
    </main>
  );
}
