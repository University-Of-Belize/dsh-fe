import { toast } from "@zerodevx/svelte-toast";
import config from "$lib/config/settings";
import {
    S3Client,
    ListBucketsCommand,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
    region: "auto",
    endpoint: config["server"]["s3"]["bucket-id"],
    credentials: {
        accessKeyId: config["server"]["s3"]["access-key-id"],
        secretAccessKey: config["server"]["s3"]["secret-key-id"],
    },
});

async function R2S3Upload(event: Event) {
    let pub_url: string;  // Public URL to file
    const file = event.target.files[0]; // File to be uploaded

    // Get the signed URL
    const url = await getSignedUrl(
        S3,
        new PutObjectCommand({
            Bucket: "primary-uswest",
            Key: event.target.files[0].name,
        }),
        {
            expiresIn: 60 * 60 * 4, // 4h
        }
    );

    // And upload it
    await fetch(url, {
        headers: {
            "Content-Type": file.type
        },
        method: 'PUT',
        body: file
    })
        .then((response) => {
            if (!response.ok) {
                toast.push(`Oops. Something unexpected happened while uploading the file: ${response}`);
            }
            // What to do after uploading the file
            toast.push(`You have updated the photo successfully.`); // Push notification that upload succeeded
            // Return the URL to the file
            pub_url = (`${config["server"]["s3"]["pub-bucket-id"]}/${file.name}`);  // Constructed URL
        })
        .catch((error) => {
            console.error(error);
            toast.push(`Oops. Something unexpected happened while uploading the file: ${error.message}`);
            return (config["product-view"]["default-image"])
        })
    return (pub_url ?? config["product-view"]["default-image"])
}

export { R2S3Upload }