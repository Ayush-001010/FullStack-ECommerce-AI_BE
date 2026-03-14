import { S3Client  , GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import dotenv from 'dotenv';

dotenv.config();

 
const s3Client = new S3Client({
    region:"ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_Access_Key!,
        secretAccessKey: process.env.AWS_Access_Secret_Key!,
    },
});

const getImages = async (key: string) => {
    try{
        const policy = JSON.stringify({
            Statement: [
                {
                    Resource: `https://${process.env.AWS_Distribution_Name}/${key}`,
                    Condition: {
                        DateLessThan: { "AWS:EpochTime": Math.floor(Date.now() / 1000) + 3600 },
                    },
                },
            ],
        });

        const url = getSignedUrl({
            url: `https://${process.env.AWS_Distribution_Name}/${key}`,
            privateKey: process.env.AWS_Distribution_Private_Key!,
            keyPairId: process.env.AWS_Key_Pair_Id!,
            policy: policy,
        });
        
        return {success : true , data : url};
    } catch(error){
        console.error("Error generating signed URL:", error);
    }
};

export default getImages;