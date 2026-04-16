export default function DMCAPolicypage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl text-gray-400 leading-relaxed">
      <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-12">
        DMCA <span className="text-accent">Policy</span>
      </h1>
      
      <div className="bg-primary-light border border-white/5 rounded-[2rem] p-10 md:p-16 space-y-8">
        <p>
          h5games space respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, h5games space will respond expeditiously to claims of copyright infringement.
        </p>

        <section className="space-y-4">
          <h3 className="text-white font-bold uppercase italic">Filing a Takedown Request</h3>
          <p>
            If you believe your copyrighted work is being used on h5games space without authorization, please send a formal notice to <span className="text-white font-bold">support@h5games.space</span> that includes:
          </p>
          <ul className="list-decimal pl-6 space-y-4 text-sm">
            <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material on h5games space that is claimed to be infringing (URL).</li>
            <li>Information to contact you (address, phone number, email).</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized.</li>
            <li>A statement, under penalty of perjury, that the information in the notification is accurate.</li>
          </ul>
        </section>

        <div className="bg-accent/10 p-8 rounded-2xl border border-accent/20 text-gray-300 italic text-sm">
          Please note that we primarily host open-source games from GitHub. If you own a repository and wish to have it removed from our crawler, simply removing the "html5-game" topic from your GitHub repo will automatically remove it from h5games space during our next scheduled sync.
        </div>
      </div>
    </div>
  );
}
