import { getAIConfig } from "@/lib/crm/actions/ai-config";
import { ConfigIAClient } from "./_components/ConfigIAClient";

export default async function ConfigIAPage() {
    const config = await getAIConfig();
    return <ConfigIAClient initialConfig={config} />;
}
