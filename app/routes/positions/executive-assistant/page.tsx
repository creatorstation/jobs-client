import type { Route } from './+types/page';

import { SubmitForm } from '~/components/SubmitForm';
import { userStore } from '~/store/user-store';
import { useEffect } from 'react';
import { AuthButtons } from '~/components/AuthButtons';
import { appStore } from '~/store/app-store';
import { handleLinkedInAuth } from '~/helpers/handleLinkedInLogin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Executive Assistant' },
    {
      name: 'description',
      content: 'Join CreatorStation as an Executive Assistant and contribute to top Turkish YouTube channels!',
    },
  ];
}

export default function ExecutiveAssistant() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/executive-assistant` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Executive Assistant</h1>

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
        <h2 className="text-2xl font-semibold mb-2">Position</h2>
        <p className="text-gray-700">Executive Assistant</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Location</h2>
        <p className="text-gray-700">
          This is a full-time, onsite role based at our Vadistanbul office on the European side of Istanbul. Candidates
          must reside on the European side of Istanbul.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Why Join Us?</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <strong>Direct Impact:</strong> Work closely with our CEO and senior leadership to drive strategic business
            initiatives.
          </li>
          <li>
            <strong>Dynamic Projects:</strong> Engage in a fast-paced setting where every day brings new challenges in
            project management and operational efficiency.
          </li>
          <li>
            <strong>Career Growth:</strong> Enhance your skills in business management, project coordination, and
            executive support while contributing to cutting-edge digital storytelling initiatives.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We're Looking For</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <strong>Proactive Organizer:</strong> You excel in managing calendars, coordinating meetings, and following
            up on tasks and projects with precision.
          </li>
          <li>
            <strong>Effective Communicator:</strong> Fluent in English, you have strong written and verbal communication
            skills, essential for liaising with the CEO and diverse teams.
          </li>
          <li>
            <strong>Social Media Savvy:</strong> A solid understanding of social media trends and platforms is a must,
            enabling you to support digital initiatives and engage effectively with content creators.
          </li>
          <li>
            <strong>Detail-Oriented:</strong> Your attention to detail ensures that every project, meeting, and event
            runs smoothly and deadlines are met.
          </li>
          <li>
            <strong>Team Player:</strong> You thrive in collaborative settings and can seamlessly coordinate with
            internal and external stakeholders.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Role</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <strong>Calendar & Meeting Management:</strong> Organize and coordinate meetings, events, and travel
            schedules with precision.
          </li>
          <li>
            <strong>Task & Project Follow-Up:</strong> Monitor progress on critical projects, coordinate with team
            members, and ensure timely completion of action items.
          </li>
          <li>
            <strong>Operational Coordination:</strong> Assist with day-to-day business operations, preparing reports,
            handling logistics, and managing cross-department communications.
          </li>
          <li>
            <strong>Social Media Integration:</strong> Leverage your social media expertise to support digital
            initiatives, ensuring alignment with broader business strategies.
          </li>
          <li>
            <strong>Stakeholder Liaison:</strong> Serve as the primary point of contact for internal and external
            stakeholders, fostering smooth communication and collaboration.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What You Bring</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>A passion for streamlining business operations and supporting dynamic leadership.</li>
          <li>A proactive, solution-oriented mindset with excellent organizational skills.</li>
          <li>
            Experience in managing calendars, coordinating meetings, and overseeing projects in a fast-paced
            environment.
          </li>
          <li>Fluency in English with exceptional communication skills.</li>
          <li>Strong social media knowledge to support digital projects and creative initiatives.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ready to Make Your Mark?</h2>
        <p className="text-gray-700">
          Join our team and play a crucial role in our journey as we revolutionize digital content and business
          excellence—working hand in hand with our CEO and leadership team.
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Executive Assistant" submitBtnText="Apply for Executive Assistant" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="executive-assistant" />
          </div>
        )}
      </div>
    </main>
  );
}
