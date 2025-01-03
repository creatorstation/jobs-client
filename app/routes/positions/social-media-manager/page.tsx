import { GoogleLogin } from '@react-oauth/google';
import type { Route } from './+types/page';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { PhoneInput } from 'react-international-phone';
import { isPhoneValid } from '~/helpers/isPhoneValid';
import { SubmitForm } from '~/components/SubmitForm';
import { AuthButtons } from '~/components/AuthButtons';
import { userStore } from '~/store/user-store';
import { appStore } from '~/store/app-store';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Social Media Manager' },
    {
      name: 'description',
      content: 'Join CreatorStation as a Social Media Manager and contribute to top Turkish YouTube channels!',
    },
  ];
}

type UserData = {
  name: string;
  email: string;
  phone: string;
  cv: FileList;
  europeSide: string;
  semt: string;
  linkedin: string;
};

export default function SocialMediaManager() {
  const { updateUserData } = userStore();
  const { appData } = appStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios
        .get('https://i4qbeevmo5.execute-api.us-east-1.amazonaws.com/v1/api/auth/linkedin', {
          params: {
            code,
            redirect_uri: redirectUri,
          },
        })
        .then((response) => {
          const { data } = response;

          updateUserData({ email: data.email, name: data.name });
          toast('Signed in successfully!', { type: 'success' });
        })
        .catch((error) => {
          window.history.replaceState({}, document.title, window.location.pathname);

          window.location.reload();
        });
    }
  }, []);

  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/social-media-manager` : '';

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Social Media Manager</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About CreatorStation</h2>
        <p className="text-gray-700">
          CreatorStation is Turkey’s premier influencer marketing and talent management agency, spearheading some of the
          country’s top social media channels and producing captivating original content across entertainment,
          education, style, beauty, and travel. With a commitment to innovation and storytelling, we thrive on building
          influential communities that engage audiences and shape the cultural conversation.
        </p>
        <h3 className="text-xl font-semibold mt-4">What You’ll Do</h3>
        <p className="text-gray-700">
          As our Senior Social Media Manager, you will be instrumental in shaping and driving the strategic vision for
          our social channels. You will lead a team dedicated to producing compelling, platform-specific content that
          both resonates with our followers and advances our clients’ goals. This role will involve working closely with
          influencers, creators, and our internal production team to deliver exceptional results.
        </p>
        <h3 className="text-xl font-semibold mt-4">Key Responsibilities</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Strategic Planning & Execution: Develop and implement data-driven social media strategies across TikTok,
            Instagram, and LinkedIn that align with our clients’ brand narratives and business objectives.
          </li>
          <li>
            Content Oversight: Guide the end-to-end content lifecycle—from ideation and scripting to production and
            publishing—ensuring the quality, consistency, and timeliness of all outputs.
          </li>
          <li>
            Team Leadership: Manage and mentor a team of social media associates, content creators, and interns,
            fostering a collaborative, high-performance environment.
          </li>
          <li>
            Performance Analysis: Track and analyze key metrics (engagement, reach, follower growth) to refine
            strategies, deliver actionable insights, and communicate results to stakeholders.
          </li>
          <li>
            Influencer & Partner Relations: Work closely with top Turkish influencers and brand partners, negotiating
            collaborations, overseeing campaigns, and ensuring optimal brand representation.
          </li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">Requirements</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Experience: A minimum of 3 years of professional experience in social media management, ideally within an
            agency or brand environment.
          </li>
          <li>
            Platform Expertise: Deep understanding of social platforms (Instagram, TikTok, LinkedIn) and emerging
            trends.
          </li>
          <li>
            Technical Skills: Proficiency with content creation tools (e.g., Canva) and familiarity with video and photo
            editing software.
          </li>
          <li>
            Communication & Leadership: Exceptional verbal and written communication skills in Turkish and a strong
            command of English; proven ability to lead, inspire, and develop team members.
          </li>
          <li>Location: Full-time, onsite role at our Vadistanbul office (European side of Istanbul).</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">What’s in It for You?</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            Growth & Impact: Play a pivotal role in shaping the social presence of leading brands and influencers.
          </li>
          <li>
            Team Environment: Join a forward-thinking, collaborative team that values creativity, innovation, and
            strategic insight.
          </li>
          <li>
            Professional Development: Hone your leadership, digital marketing, and social media skills in a vibrant,
            fast-paced setting.
          </li>
        </ul>
        <p className="mt-4">
          <strong>Ready to Lead the Conversation?</strong>
        </p>
        <p className="text-gray-700">
          If you’re ready to elevate your career and make a lasting impact in the world of social media, apply now and
          help shape the future of our digital storytelling at CreatorStation!
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Social Media Manager" submitBtnText="Apply for Social Media Manager" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="social-media-manager" />
          </div>
        )}
      </div>
    </main>
  );
}
