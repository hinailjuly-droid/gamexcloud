export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl mb-20">
      <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-12">
        Privacy <span className="text-accent">Policy</span>
      </h1>
      
      <div className="bg-primary-light border border-white/10 rounded-[2rem] p-10 md:p-16 space-y-12 text-gray-400 leading-loose">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 uppercase italic">Introduction</h2>
          <p>
            At h5games space, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your information when you visit our website. Our primary goal is to provide a safe and transparent gaming environment.
          </p>
        </section>

        <section id="adsense">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase italic">Google AdSense Disclosure</h2>
          <div className="bg-accent/5 border border-accent/10 p-6 rounded-2xl text-gray-300">
            <p className="mb-4">
              h5games space uses Google AdSense and third-party advertising companies to serve ads when you visit our website. These companies may use cookies and web beacons to collect information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm italic">
              <li>Google, as a third-party vendor, uses cookies to serve ads on h5games space.</li>
              <li>Google's use of the DART cookie enables it to serve ads to our users based on their visit to our sites and other sites on the Internet.</li>
              <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 uppercase italic">Data We DO NOT Collect</h2>
          <p>
            Because h5games space does not require registration or login, we do not collect:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Your Name</li>
            <li>Your Email Address</li>
            <li>Your Location (except general region for analytics)</li>
            <li>Your Personal Identity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 uppercase italic">Analytics</h2>
          <p>
            We use basic internal analytics to track game popularities (plays, views). This data is anonymized and used only to improve our game suggestions and platform ranking.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 uppercase italic">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@h5games.space.
          </p>
        </section>
      </div>
    </div>
  );
}
