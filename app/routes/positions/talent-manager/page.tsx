import type { Route } from './+types/page';

import { SubmitForm } from '~/components/SubmitForm';
import { userStore } from '~/store/user-store';
import { useEffect } from 'react';
import { AuthButtons } from '~/components/AuthButtons';
import { appStore } from '~/store/app-store';
import { handleLinkedInAuth } from '~/helpers/handleLinkedInLogin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Talent Manager' },
    {
      name: 'description',
      content:
        'Join CreatorStation as a Talent Manager and drive strategic business initiatives with AI and process optimization!',
    },
  ];
}

export default function TalentManager() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/talent-manager` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Talent Manager</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-700">
          CreatorStation is a leader in influencer marketing, talent management, and social media production,
          exclusively managing some of Turkey's top YouTube channels across entertainment, gaming, education, style,
          beauty, and travel verticals. We specialize in producing high-performing content for Turkish audiences. Check
          out our Instagram{' '}
          <a className="text-blue-500" href="https://crst.io/ig">
            @creatorstation
          </a>{' '}
          and YouTube channel{' '}
          <a className="text-blue-500" href="https://crst.io/yt">
            Youtuber Durağı
          </a>{' '}
          to see our work in action!
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700">
          We are looking for an Influencer Talent Manager with proven experience in influencer marketing to join our
          team. In this role, you will work closely with influencers and brands, ensuring their success by managing
          collaborations and resolving any challenges they may face.
        </p>
      </section>

      <div id="reqs">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              Act as a bridge between <strong>influencers and brands</strong>, managing projects from brief to
              reporting.
            </li>
            <li>
              Support brands and influencers in <strong>creating high-quality, engaging branded content</strong> on
              social media.
            </li>
            <li>
              Ensure high levels of <strong>brand and influencer satisfaction</strong>, maintaining strong
              relationships.
            </li>
            <li>
              Meet and exceed <strong>quarterly and annual growth targets</strong>.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Requirements </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>Bachelor’s or Master’s degree</strong> in a related field.
            </li>
            <li>
              <strong>At least 2 years of experience</strong> in influencer marketing, account management, or talent
              management within a marketing, creative, or digital agency.
            </li>
            <li>
              Strong <strong>interpersonal, communication, and presentation skills.</strong>
            </li>
            <li>
              <strong>Fluency in Turkish (native-level)</strong> and <strong>strong English proficiency</strong>.
            </li>
            <li>
              This is a <strong>full-time, on-site</strong> position based in <strong>Vadistanbul</strong>.
            </li>
          </ul>
        </section>
      </div>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ready to Make Your Mark?</h2>
        <p className="text-gray-700">
          If you’re passionate about influencer marketing and want to work with top creators and brands, apply now!🚀
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Talent Manager" submitBtnText="Apply for Talent Manager" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="talent-manager" />
          </div>
        )}
      </div>
    </main>
  );
}
