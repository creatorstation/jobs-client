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
    { title: 'CreatorStation | Business Analyst' },
    {
      name: 'description',
      content:
        'Join CreatorStation as a Business Analyst and drive strategic business initiatives with AI and process optimization!',
    },
  ];
}

export default function BusinessAnalyst() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/business-analyst` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Business Analyst</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">About Us</h2>
        <p className="text-gray-700">
          At CreatorStation, we're shaping the future of digital content! As a trailblazer in influencer marketing and
          talent management, we partner with Turkey's top creators on YouTube, Instagram, and TikTok across
          entertainment, gaming, education, style, beauty, and travel. With over 50 million subscribers and 40 million
          unique viewers monthly, we produce dynamic, high-quality content that keeps audiences coming back for more. If
          you're passionate about YouTube, Instagram, and TikTok, have an eye for beauty trends, and love bringing
          creative ideas to life, we'd love to have you on board. Explore our work on Instagram{' '}
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
        <h2 className="text-2xl font-semibold mb-2">Position Overview</h2>
        <p className="text-gray-700">
          We are seeking a detail-oriented Business Analyst to monitor, define, and optimize our internal and customer
          processes. In this role, you will apply your expertise in industrial engineering (or a related field) and AI
          concepts to identify opportunities for operational improvements and drive strategic business initiatives.
          Fluency in English is a must, as you will collaborate with cross-functional teams and communicate complex
          ideas clearly to diverse stakeholders.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Key Responsibilities</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Process Monitoring &amp; Optimization</strong>: Analyze current business processes and workflows to
            identify inefficiencies and opportunities for improvement. Develop and implement process optimization
            strategies tailored to both internal operations and customer needs.
          </li>
          <li>
            <strong>Data-Driven Analysis &amp; AI Integration</strong>: Utilize data analytics and AI concepts to inform
            decision-making and forecast business trends. Oversee data training protocols and ensure that data used for
            AI models is accurately curated and integrated. Prepare detailed reports and dashboards to monitor process
            performance and communicate findings to stakeholders.
          </li>
          <li>
            <strong>Cross-Functional Collaboration</strong>: Work closely with various teams to understand business
            challenges and propose effective solutions. Act as a liaison between technical teams and business units,
            ensuring alignment on project goals and strategies.
          </li>
          <li>
            <strong>Strategic Implementation</strong>: Define, document, and implement best practices for process
            improvements. Support the development of new business models and operational strategies driven by technology
            and innovation.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Experience &amp; Qualifications</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Educational Background</strong>: A degree in Industrial Engineering or a related field is required.
          </li>
          <li>
            <strong>Professional Expertise</strong>: Proven experience in business analysis with a focus on process
            optimization.
          </li>
          <li>
            <strong>AI &amp; Data Proficiency</strong>: Solid understanding of AI concepts, data analytics tools, and
            familiarity with data training methodologies.
          </li>
          <li>
            <strong>Detail-Oriented</strong>: Strong attention to detail with the ability to manage multiple projects
            simultaneously.
          </li>
          <li>
            <strong>Communication Skills</strong>: Fluent in English, with excellent written and verbal communication
            skills.
          </li>
          <li>
            <strong>Analytical Mindset</strong>: Demonstrated ability to transform data into actionable business
            strategies.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Why Join Us?</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <strong>Innovative Environment</strong>: Work at the forefront of digital content and influencer marketing,
            utilizing the latest AI, data training, and analytical tools.
          </li>
          <li>
            <strong>Collaborative Culture</strong>: Join a dynamic team where your insights directly impact strategic
            decisions and operational excellence.
          </li>
          <li>
            <strong>Career Growth</strong>: Opportunity to develop and refine your skills in business analysis, process
            optimization, and AI integration, supported by a forward-thinking organization.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ready to Make Your Mark?</h2>
        <p className="text-gray-700">
          If you’re passionate about leveraging technology and data training to drive business success and enjoy working
          in a fast-paced, innovative environment, we’d love to hear from you. Apply today to be a key contributor to
          our journey of continuous improvement and digital transformation.
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Business Analyst" submitBtnText="Apply for Business Analyst" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="business-analyst" />
          </div>
        )}
      </div>
    </main>
  );
}
