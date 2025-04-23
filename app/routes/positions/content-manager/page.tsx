import type { Route } from './+types/page';

import { SubmitForm } from '~/components/SubmitForm';
import { userStore } from '~/store/user-store';
import { useEffect } from 'react';
import { AuthButtons } from '~/components/AuthButtons';
import { appStore } from '~/store/app-store';
import { handleLinkedInAuth } from '~/helpers/handleLinkedInLogin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'CreatorStation | Content Manager' },
    {
      name: 'description',
      content:
        'Join CreatorStation as an Content Manager and drive strategic business initiatives with AI and process optimization!',
    },
  ];
}

export default function ContentManager() {
  const { updateUserData } = userStore();
  const { appData, updateAppData } = appStore();

  useEffect(() => {
    handleLinkedInAuth(
      typeof window !== 'undefined' ? `${window.location.origin}/content-manager` : '',
      updateUserData,
      updateAppData,
    );
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Content Manager</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700">
          <a className="text-blue-500" href="https://www.youtube.com/@Literatsf">
            Literat YouTube
          </a>{' '}
          kanalımızın içeriklerini daha ileri seviyeye taşımak ve izleyicilerimize eşsiz bir deneyim sunmak için
          yaratıcı, yenilikçi ve dinamik bir İçerik Geliştirme Uzmanı arıyoruz. Bu rolü üstlenecek kişi, kanalımızın
          içerik stratejisini destekleyici araştırmalar yaparak, özgün ve etkili içeriklerin geliştirilmesinden sorumlu
          olacaktır. Ayrıca konuklarla olan iletişimi yöneterek prodüksiyon sürecini sorunsuz ve etkin bir şekilde
          yürütecektir.
        </p>
      </section>

      <div id="reqs">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Temel Sorumluluklar</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>İçeriklerin oluşturulması için kapsamlı ön araştırmalar yapmak.</li>
            <li>Prodüksiyona girecek içerikler için detaylı ve ilgi çekici senaryolar hazırlamak.</li>
            <li>
              Konuklarla iletişimi aktif ve etkili biçimde sağlayarak içerik detaylarını ve planlamaları koordine etmek.
            </li>
            <li>Tüm içerik hazırlıklarını zamanında tamamlayarak prodüksiyona hazır hale getirmek.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Aranan Nitelikler</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>İyi derecede İngilizce bilgisi (yazılı ve sözlü).</li>
            <li>Güçlü araştırma yeteneği ve bilgiyi sentezleme becerisi.</li>
            <li>Organizasyon ve planlama konusunda yetkin.</li>
            <li>Güçlü iletişim ve insan ilişkileri becerileri.</li>
            <li>Ekip çalışmasına yatkın ve yoğun çalışma temposuna adapte olabilme yeteneği.</li>
          </ul>
        </section>
      </div>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Tercih Sebepleri</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>İçerik üretimi, araştırma veya prodüksiyon alanlarında deneyim.</li>
          <li>YouTube içerik stratejileri ve dijital medya platformları hakkında bilgi sahibi olmak.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2"></h2>
        <p className="text-gray-700">
          Büyüyen izleyici kitlemiz için ilgi çekici ve kaliteli içerikler üretme yolculuğumuza katılın!
        </p>
      </section>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg border text-center">
        <SubmitForm positionName="Content Manager" submitBtnText="Apply for Content Manager" />
        {appData.step === 0 && (
          <div className="relative mb-4 mt-12">
            <span className="relative bottom-3 bg-white px-2 text-gray-500">Or</span>
            <AuthButtons redirPath="content-manager" />
          </div>
        )}
      </div>
    </main>
  );
}
