import type { Route } from './+types/page';

import { SubmitForm } from '~/components/SubmitForm';
import { userStore } from '~/store/user-store';
import { useEffect } from 'react';
import { AuthButtons } from '~/components/AuthButtons';
import { appStore } from '~/store/app-store';
import { handleLinkedInAuth } from '~/helpers/handleLinkedInLogin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Account Specialist' },
    {
      name: 'description',
      content:
        'Join CreatorStation as an Account Specialist and drive strategic business initiatives with AI and process optimization!',
    },
  ];
}

export default function AccountSpecialist() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/account-specialist` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Account Specialist</h1>

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
          We are looking for an <strong>Account Specialist</strong> with{' '}
          <strong>proven experience in influencer marketing</strong> to join our team. In this role, you will
          <strong>collaborate with brands and influencers</strong>, ensuring the success of their campaigns while
          managing and resolving any challenges that arise.
        </p>
      </section>
      <div id="reqs">
        <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Responsibilities</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            Serve as the <strong>primary liaison</strong> between brands and influencers, managing projects from start
            to completion.
          </li>
          <li>
            Guide and support brands and influencers in{' '}
            <strong>creating compelling, high-performing social media content.</strong>
          </li>
          <li>
            Ensure <strong>high satisfaction levels</strong> for brands, influencers, and their audiences.
          </li>
          <li>
            Consistently achieve <strong>quarterly and annual growth targets.</strong>
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
            <strong>Minimum of 3 years of experience</strong> in account management within a{' '}
            <strong>Creative, Digital, or Influencer Marketing Agency</strong> (influencer marketing experience is a
            must).
          </li>
          <li>
            Strong <strong>interpersonal, communication, and presentation skills.</strong>
          </li>
          <li>
            <strong>Fluency in Turkish (native-level)</strong> and <strong>proficiency in English.</strong>
          </li>
          <li>
            <strong>Full-time, on-site</strong> position based in <strong>Vadistanbul</strong>.
          </li>
          <li>
            Candidates must reside on the <strong>European side of Istanbul, preferably near Vadistanbul.</strong>
          </li>
        </ul>
      </section>
      
      </div>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ready to Make Your Mark?</h2>
        <p className="text-gray-700">
          If you have a strong background in influencer marketing and want to work with top brands and creators, apply
          now!🚀
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Account Specialist" submitBtnText="Apply for Account Specialist" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="account-specialist" />
          </div>
        )}
      </div>
    </main>
  );
}
