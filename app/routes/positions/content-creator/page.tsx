import type { Route } from './+types/page';

import { SubmitForm } from '~/components/SubmitForm';
import { userStore } from '~/store/user-store';
import { useEffect } from 'react';
import { AuthButtons } from '~/components/AuthButtons';
import { appStore } from '~/store/app-store';
import { handleLinkedInAuth } from '~/helpers/handleLinkedInLogin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Content Creator' },
    {
      name: 'description',
      content: 'Join CreatorStation as a Content Creator and contribute to top Turkish YouTube channels!',
    },
  ];
}

export default function ContentCreator() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/content-creator` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Content Creator (On-Camera Talent)</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-700">
          At CreatorStation, we're shaping the future of digital content and business innovation! As a leader in
          influencer marketing and talent management, we partner with Turkey's top creators on YouTube, Instagram, and
          TikTok across entertainment, gaming, education, style, beauty, and travel. With over 50 million subscribers
          and 40 million unique viewers monthly, we drive dynamic, high-quality projects that captivate audiences and
          deliver measurable impact. Join us if you're passionate about efficient business operations, proactive project
          follow-ups, and dynamic teamwork. Explore our work on Instagram{' '}
          <a className="text-blue-500" href="https://crst.io/ig">
            @creatorstation
          </a>{' '}
          and YouTube{' '}
          <a className="text-blue-500" href="https://crst.io/yt">
            Youtuber Durağı
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Position Overview</h2>
        <p className="text-gray-700">
          We're seeking an energetic and innovative Content Creator who excels at conceptualizing, editing, and
          producing "made for social" videos. In this role, you will be instrumental in brainstorming, pitching, and
          executing creative video content that aligns with our brand's voice and strategic marketing initiatives. You
          will work closely with cross-functional teams to produce both long and short form videos tailored for various
          social media platforms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Location & Language Requirements</h2>
        <p className="text-gray-700">
          This is a full-time, onsite role based at our Vadistanbul office on the European side of Istanbul. Candidates
          must reside on the European side of Istanbul. Native proficiency in Turkish is required, along with strong
          proficiency in English.
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

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We're Looking For</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Social Media Enthusiast: You actively follow creators and stay tuned to the latest trends on YouTube,
            Instagram, and TikTok.
          </li>
          <li>
            Beauty & Makeup Pro: You're familiar with makeup, beauty products, and the latest trends in the industry.
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

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Key Responsibilities</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Concept & Production</strong>: Develop, edit, and produce engaging "made for social" videos using
            native storytelling techniques. Create bespoke social video content in both long and short formats,
            customized for specific platforms and marketing campaigns.
          </li>
          <li>
            <strong>Creative Leadership</strong>: Lead brainstorming sessions, pitch innovative ideas, and drive the
            production of video franchises that are on-brand, on-trend, and optimized for digital audiences. Evangelize
            and educate internal teams and clients on effective native social storytelling.
          </li>
          <li>
            <strong>Content Capture & Collaboration</strong>: Be the face of our content—on camera and behind the
            scenes—capturing original footage and collaborating with internal and external production partners to
            maintain a steady pipeline of high-quality social video content.
          </li>
          <li>
            <strong>Trend & Technology Monitoring</strong>: Stay current on global creative trends, award-winning
            campaigns, and emerging production techniques. Leverage the latest digital tools and design software to
            continuously enhance creative output.
          </li>
          <li>
            <strong>Cross-Functional Partnership</strong>: Collaborate with diverse teams to develop and execute
            best-in-class social video strategies, ensuring our content resonates with multiple audiences and drives
            engagement.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Role</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Manage video and social media content preparations, track timelines, and ensure seamless
            execution.
          </li>
          <li>
            Handle procurement, returns, and organization of materials, including makeup and
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
        <h2 className="text-2xl font-semibold mb-2">Experience &amp; Qualifications</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Deep Editing &amp; Production Expertise</strong>: Proven experience in editing, producing, and
            publishing social-first video content tailored for platforms like YouTube, Instagram, and TikTok.
          </li>
          <li>
            <strong>Strategic Social Video Background</strong>: A track record of defining and implementing social video
            strategies at a platform level, including always-on content and repeatable content series.
          </li>
          <li>
            <strong>Data-Driven Insight</strong>: Ability to use social trends and data to identify brand opportunities
            and influence key stakeholders.
          </li>
          <li>
            <strong>On-Camera Presence</strong>: Confident, engaging, and natural when presenting on camera while
            aligning with brand guidelines.
          </li>
          <li>
            <strong>Technical Proficiency</strong>: Skilled in industry-standard video editing software and digital
            tools.
          </li>
          <li>
            <strong>Trend Awareness</strong>: A strong understanding of current pop culture, social media trends, and
            audience behavior to inform and inspire creative content.
          </li>
          <li>
            <strong>Language Skills</strong>: Native proficiency in Turkish and strong proficiency in English.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ready to Make Your Mark?</h2>
        <p className="text-gray-700">
          Join us at CreatorStation and be the driving force behind compelling social content that not only tells
          stories but also connects with audiences worldwide. Apply today and help shape the future of digital
          storytelling!
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Content Creator" submitBtnText="Apply for Content Creator" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="content-creator" />
          </div>
        )}
      </div>
    </main>
  );
}
