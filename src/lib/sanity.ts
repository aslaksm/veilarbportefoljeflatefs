import {
    ClientConfig,
    createClient,
    createImageUrlBuilder,
    createPortableTextComponent,
    createPreviewSubscriptionHook,
} from "next-sanity";

const config: ClientConfig = {
    dataset: "production",
    projectId: "9ediv52f",
    useCdn: process.env.NODE_ENV === "production",
};

export const urlFor = (source: any) => createImageUrlBuilder(config).image(source);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const PortableText = createPortableTextComponent({
    ...config,
    serializers: {},
});

const sanityClient = createClient(config);

const previewClient = createClient({
    ...config,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

export const getClient = (usePreview: boolean) => (usePreview ? previewClient : sanityClient);
