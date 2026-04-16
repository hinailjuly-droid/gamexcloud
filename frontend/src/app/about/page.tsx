export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-12 text-center">
        About <span className="text-accent underline decoration-white/10">h5games space</span>
      </h1>
      
      <div className="prose prose-invert max-w-none text-gray-400 space-y-8 text-lg font-medium leading-relaxed">
        <p>
          h5games space is the ultimate premium gateway to the world of open-source HTML5 games. We believe that the best gaming experiences should be accessible to everyone, everywhere, without the barriers of downloads, logins, or high-end hardware.
        </p>
        
        <div className="bg-primary-light p-8 rounded-3xl border border-white/5 my-12">
          <h2 className="text-2xl font-black text-white uppercase italic mb-4">Our Mission</h2>
          <p className="text-gray-300">
            Our mission is to aggregate, curate, and showcase high-quality, open-source web games developed by passionate creators around the globe. We provide a platform that honors their work while giving players a lightning-fast, beautiful interface to discover their next favorite game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tight">Open Source First</h3>
            <p className="text-sm">
              Every game on h5games space is sourced from open-source repositories (primarily GitHub). We respect licenses and provide direct links back to the source code for every title.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tight">No Strings Attached</h3>
            <p className="text-sm">
              We don't collect your data, we don't require accounts, and we certainly don't charge for play. Just visit, click, and play.
            </p>
          </div>
        </div>
        
        <p className="pt-12 text-center">
          h5games space is a product of passion, built using Next.js 14 and powered by the massive community of indie developers on GitHub.
        </p>
      </div>
    </div>
  );
}
