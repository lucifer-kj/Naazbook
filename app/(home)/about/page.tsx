import { Heart, Book, Users, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-[#F6F1E7] min-h-screen w-full pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[260px] flex flex-col items-center justify-center bg-[var(--islamic-green)] overflow-hidden text-center px-4 pt-8 pb-10">
        <span className="absolute inset-0 bg-gradient-to-br from-[var(--islamic-green)]/90 via-[var(--islamic-green-light)]/80 to-[var(--islamic-gold)]/40 z-0" aria-hidden="true" />
        <Image
          src="/Images/Image+Background.jpg"
          alt="Naaz Book Depot Hero Background"
          fill
          priority
          className="object-cover object-center w-full h-full absolute inset-0 z-0 opacity-30"
        />
        <div className="relative z-10 w-full flex flex-col items-center">
          <h1 className="text-2xl font-headings font-bold text-white mb-2 drop-shadow-lg">About Naaz Book Depot</h1>
          <div className="text-lg text-white/90 mb-1 font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="text-sm text-white/80 mb-2">&quot;Jazakum Allahu Khayran&quot; - May Allah reward you with goodness</div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h2 className="text-2xl font-headings font-bold text-[var(--islamic-green)] text-center mb-1 mt-2">A Legendary<br />Legacy Since 1967</h2>
        <div className="h-1 w-20 bg-[#C7A536] rounded mb-4 mx-auto" />
        <p className="text-base text-[var(--charcoal)]/90 mb-3 text-center max-w-md">
          Founded in the heart of Kolkata in 1967, Naaz Book Depot has served as a beacon of Islamic knowledge for over five decades. What started as a humble mission has evolved into a legendary legacy in the Islamic publishing community.
        </p>
        <p className="text-base text-[var(--charcoal)]/90 mb-3 text-center max-w-md">
          At the core of this mission stands <span className="font-bold">MD Irfan</span>, the esteemed Director of Naaz Book Depot. With over 60 years of experience in Islamic publishing, he has personally overseen the publication of <span className="font-bold">more than 2,000 Islamic titles</span>, including Qur’ans, Tafsir, Duas, Ruqyas, and other essential texts.
        </p>
        <p className="text-base text-[var(--charcoal)]/90 mb-6 text-center max-w-md">
          Known throughout India for his unwavering commitment to Islamic knowledge, <span className="font-bold">MD Irfan</span> has transformed Naaz Book Depot into a vital source of authentic Islamic literature, serving the Ummah with dedication and Islamic principles for over 60 years.
        </p>
        {/* Image Card */}
        <div className="bg-[#F6F1E7] rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs mx-auto mb-6">
          <div className="w-full rounded-xl overflow-hidden mb-3">
            <Image
              src="/Images/IMG-20250626-WA0016.jpg"
              alt="MD Irfan"
              width={320}
              height={220}
              className="object-cover w-full h-44"
              priority
            />
          </div>
          <div className="text-center">
            <div className="font-bold text-[var(--islamic-green)] text-base">MD Irfan</div>
            <div className="text-[#C7A536] text-sm font-semibold">Director, Naaz Book Depot</div>
            <div className="text-xs text-[var(--charcoal)]/80">A lifelong contributor to Qur’anic knowledge</div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="bg-[#F6F1E7] w-full px-4 py-8 flex flex-col items-center">
        <h2 className="text-xl font-headings font-bold text-[var(--islamic-green)] text-center mb-6">Our Mission & Values</h2>
        <div className="space-y-7 w-full max-w-md">
          <div className="flex items-start gap-3">
            <Heart className="w-6 h-6 text-[#C7A536] mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold text-[var(--islamic-green)] text-base mb-1">Authentic Islamic Knowledge</div>
              <div className="text-sm text-[var(--charcoal)]/90">We are committed to publishing only authentic Islamic literature, verified by qualified scholars and rooted in traditional Islamic teachings.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Book className="w-6 h-6 text-[#C7A536] mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold text-[var(--islamic-green)] text-base mb-1">Educational Excellence</div>
              <div className="text-sm text-[var(--charcoal)]/90">Making Islamic education accessible through quality publications in multiple languages - Arabic, Urdu, Bengali, and English.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-[#C7A536] mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold text-[var(--islamic-green)] text-base mb-1">Serving the Ummah</div>
              <div className="text-sm text-[var(--charcoal)]/90">Selflessly serving the Muslim community with integrity, dedication, and Islamic principles for over 60 years.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Card */}
      <section className="w-full flex flex-col items-center px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
          <h3 className="text-lg font-headings font-semibold text-[var(--islamic-green)] text-center mb-5">Testimonials About Our Work</h3>
          <div className="space-y-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-14 bg-[#C7A536] rounded mr-2 mt-1" />
              <span className="italic text-[var(--charcoal)]/90 text-sm">“Your dedication to publishing authentic Islamic literature is a source of immense benefit to the Ummah.”</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-14 bg-[#C7A536] rounded mr-2 mt-1" />
              <span className="italic text-[var(--charcoal)]/90 text-sm">“May Allah bless your efforts in spreading knowledge and making Islamic teachings accessible to all.”</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-14 bg-[#C7A536] rounded mr-2 mt-1" />
              <span className="italic text-[var(--charcoal)]/90 text-sm">“Your work in publishing Qur’ans and Islamic books is a true form of Sadaqah Jariyah (continuous charity), benefiting generations to come.”</span>
            </div>
          </div>
          {/* Highlight Card */}
          <div className="bg-[#F6F1E7] rounded-lg flex items-center gap-3 px-4 py-3 mt-2">
            <CheckCircle className="w-6 h-6 text-[var(--islamic-green)] flex-shrink-0" />
            <div>
              <div className="font-bold text-[var(--islamic-green)] text-base">Over 2,000 Islamic Books Published</div>
              <div className="text-xs text-[var(--charcoal)]/80">Including Qur’ans, Tafsir, Hadith, Duas, and educational materials.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 