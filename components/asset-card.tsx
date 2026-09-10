import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Asset } from "@/lib/data";

export default function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Link href={`/assets/${asset.id}`} className="assetCard">
      <div className={`assetImage image-${asset.accent}`}>
        <span className="verified"><CheckCircle2 size={14} /> {asset.status}</span>
        <span className="assetTypeOverlay">{asset.type}</span>
      </div>
      <div className="assetInfo">
        <div className="assetType">{asset.type}</div>
        <h3>{asset.title}</h3>
        <p>{asset.location}</p>
        <div className="assetFooter"><strong>{asset.price}</strong><ArrowRight size={18} /></div>
      </div>
    </Link>
  );
}
