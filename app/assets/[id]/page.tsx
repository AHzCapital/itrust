import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, FileCheck2, MapPin, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/site-header";
import AssetCard from "@/components/asset-card";
import { assets, getAsset } from "@/lib/data";

export function generateStaticParams() {
  return assets.map((asset) => ({ id: asset.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = getAsset(id);
  return { title: asset ? `${asset.title} — Trust.Me` : "Asset — Trust.Me", description: asset?.description };
}

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) return <><SiteHeader /><div className="notFound"><span className="kicker">404</span><h1>Asset not found.</h1><Link className="primary" href="/assets">Back to marketplace <ArrowRight size={17} /></Link></div></>;
  const related = assets.filter((item) => item.id !== asset.id && item.type === asset.type).slice(0, 2);

  return <main>
    <SiteHeader />
    <div className="detailWrap">
      <Link className="backLink" href="/assets"><ArrowLeft size={16} /> Back to marketplace</Link>
      <section className="detailHero">
        <div className={`detailImage image-${asset.accent}`}><span className="verified"><CheckCircle2 size={14} /> Verified asset</span><div className="detailImageLabel">TRUST.ME / {asset.type.toUpperCase()}</div></div>
        <div className="detailIntro"><span className="kicker">ASSET PASSPORT · VERIFIED</span><h1>{asset.title}</h1><p className="detailLocation"><MapPin size={16} /> {asset.location}</p><div className="detailPrice">{asset.price}<span>Asking price</span></div><div className="detailActions"><button className="primary">Make an enquiry <ArrowRight size={17} /></button><button className="secondary">Save asset</button></div><p className="smallTrust"><ShieldCheck size={15} /> Verification-first listing. Documentation is reviewed before an asset is published.</p></div>
      </section>
      <section className="passportGrid">
        <div className="detailPanel"><span className="kicker">THE ASSET PASSPORT</span><h2>A clearer record of what you&apos;re considering.</h2><p>{asset.description}</p><div className="detailFacts"><div><span>Asset type</span><strong>{asset.type}</strong></div><div><span>Area</span><strong>{asset.area}</strong></div><div><span>Seller</span><strong>{asset.owner}</strong></div><div><span>Status</span><strong className="verifiedText">Verified</strong></div></div></div>
        <aside className="verificationPanel"><div className="verificationSeal"><ShieldCheck size={31} /></div><span className="kicker">TRUST.ME STANDARD</span><h3>Verification complete</h3><p>Key information has been reviewed against the listing requirements.</p><ul>{asset.verification.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul></aside>
      </section>
      <section className="highlights"><div><span className="kicker">KEY DETAILS</span><h2>Why it stands out.</h2></div><div className="highlightList">{asset.highlights.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></section>
      {related.length > 0 && <section className="related"><div className="sectionHead"><div><span className="kicker">MORE TO EXPLORE</span><h2>Similar <em>assets.</em></h2></div><Link className="textLink" href="/assets">View all <ArrowRight size={16} /></Link></div><div className="assetGrid">{related.map((item) => <AssetCard key={item.id} asset={item} />)}</div></section>}
    </div>
  </main>;
}
