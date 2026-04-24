export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl text-gray-400 leading-loose">
      <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-12">
        Terms of <span className="text-accent">Service</span>
      </h1>
      
      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase italic">1. Acceptance of Terms</h2>
          <p>
            By accessing and playing games on GamxCloud, you agree to be bound by these terms. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase italic">2. Use of Site</h2>
          <p>
            GamxCloud provides access to open-source HTML5 games. These games are for your personal, non-commercial use. You agree not to:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Interfere with the operation of the site or games.</li>
            <li>Use automated scripts to access or extract data from the site.</li>
            <li>Modify or redistribute the games unless permitted by the specific game's open-source license.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase italic">3. Intellectual Property</h2>
          <p>
            Games on GamxCloud belong to their respective creators as indicated in the source links. GamxCloud does not claim ownership of the games. The site design, logo, and platform infrastructure are the property of GamxCloud.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase italic">4. Disclaimer of Warranties</h2>
          <p>
            Games are provided "as is" without any warranties. We do not guarantee that games will work on all devices or be error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 uppercase italic">5. Limitation of Liability</h2>
          <p>
            GamxCloud shall not be liable for any damages arising from your use of the site or games.
          </p>
        </section>
      </div>
    </div>
  );
}
