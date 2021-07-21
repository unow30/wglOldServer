/**
 * Created by gunucklee on 2021. 07. 20.
 */

const AWS = require("aws-sdk");

const path = require('path');
const paramUtil = require('../../common/utils/paramUtil');
const funcUtil = require('../../common/utils/funcUtil');
const sendUtil = require('../../common/utils/sendUtil');
const errUtil = require('../../common/utils/errUtil');
const errCode = require('../../common/define/errCode');

module.exports =  function (req, res, next) {
    req.paramBody = paramUtil.parse(req);

    const MEDIACONVERT = 'ConvertSuccess';
    const final_name = req.file.key;
    const extname = path.extname(final_name);


    if(extname === '.mp4') {
        AWS.config.update({
            accessKeyId: funcUtil.getAWSAccessKeyID(),
            secretAccessKey: funcUtil.getAWSSecretAccessKey(),
            region : funcUtil.getAWSRegion(),
        });

        AWS.config.mediaconvert = {endpoint: funcUtil.getAWSMediaConvertEndPoint()}


        let params = {
            "Queue": funcUtil.getAWSMediaConvertQueue(),
            "UserMetadata": {
                "Customer": "Amazon"
            },
            "Role": funcUtil.getAWSMediaConvertRole(),
            "Settings": {
                "TimecodeConfig": {
                    "Source": "ZEROBASED"
                },
                "OutputGroups": [
                    {
                        "CustomName": "grege",
                        "Name": "File Group",
                        "Outputs": [
                            {
                                "ContainerSettings": {
                                    "Container": "MP4",
                                    "Mp4Settings": {
                                        "CslgAtom": "EXCLUDE",
                                        "FreeSpaceBox": "EXCLUDE",
                                        "MoovPlacement": "NORMAL"
                                    }
                                },
                                "VideoDescription": {
                                    "Width": 1080,
                                    "ScalingBehavior": "DEFAULT",
                                    "Height": 1920,
                                    "VideoPreprocessors": {
                                        "Deinterlacer": {
                                            "Algorithm": "INTERPOLATE",
                                            "Mode": "DEINTERLACE",
                                            "Control": "NORMAL"
                                        }
                                    },
                                    "TimecodeInsertion": "DISABLED",
                                    "AntiAlias": "ENABLED",
                                    "Sharpness": 50,
                                    "CodecSettings": {
                                        "Codec": "H_264",
                                        "H264Settings": {
                                            "ParNumerator": 16,
                                            "ParDenominator": 9,
                                            "Bitrate": 5000000
                                        }
                                    },
                                    "AfdSignaling": "NONE",
                                    "DropFrameTimecode": "ENABLED",
                                    "RespondToAfd": "NONE",
                                    "ColorMetadata": "INSERT"
                                },
                                "AudioDescriptions": [
                                    {
                                        "AudioTypeControl": "FOLLOW_INPUT",
                                        "CodecSettings": {
                                            "Codec": "AAC",
                                            "AacSettings": {
                                                "AudioDescriptionBroadcasterMix": "NORMAL",
                                                "Bitrate": 160000,
                                                "RateControlMode": "CBR",
                                                "CodecProfile": "LC",
                                                "CodingMode": "CODING_MODE_2_0",
                                                "RawFormat": "NONE",
                                                "SampleRate": 48000,
                                                "Specification": "MPEG4"
                                            }
                                        },
                                        "LanguageCodeControl": "FOLLOW_INPUT",
                                        "AudioType": 0
                                    }
                                ],
                                // "NameModifier": "test1111"
                                "NameModifier": "ConvertSuccess"
                            },
                            {
                                "ContainerSettings": {
                                    "Container": "RAW"
                                },
                                "VideoDescription": {
                                    "Width": 1080,
                                    "Height": 1920,
                                    "CodecSettings": {
                                        "Codec": "FRAME_CAPTURE",
                                        "FrameCaptureSettings": {
                                            "FramerateNumerator": 30,
                                            "FramerateDenominator": 88,
                                            "MaxCaptures": 1,
                                            "Quality": 80
                                        }
                                    }
                                },
                                "Extension": "jpg",
                                "NameModifier": "Thumbnail"
                            }
                        ],
                        "OutputGroupSettings": {
                            "Type": "FILE_GROUP_SETTINGS",
                            "FileGroupSettings": {
                                // "Destination": "s3://test341/"
                                // "Destination": "s3://weggle-bucket/"
                                "Destination": funcUtil.getAWSMediaConvertS3Destination()
                            }
                        }
                    }
                ],
                "Inputs": [
                    {
                        "AudioSelectors": {
                            "Audio Selector 1": {
                                "DefaultSelection": "DEFAULT"
                            }
                        },
                        "VideoSelector": {},
                        "TimecodeSource": "ZEROBASED",
                        "ImageInserter": {
                            "InsertableImages": [
                                {
                                    "Width": 170,
                                    "Height": 130,
                                    "ImageX": 900,
                                    "ImageY": 500,
                                    "Layer": 1,
                                    "ImageInserterInput": `${funcUtil.getAWSMediaConvertS3StartingPoint()}wegglelogo.png`,
                                    "Opacity": 50
                                }
                            ]
                        },
                        "FileInput": "null"
                        // "FileInput": "s3://test341/04ef74af4025fdfe30ff93beda25ee65.mp4"
                    }
                ]
            },
            "AccelerationSettings": {
                "Mode": "DISABLED"
            },
            "StatusUpdateInterval": "SECONDS_60",
            "Priority": 0,
            "HopDestinations": []
        }



        console.log('final_name' + final_name)

        const data = convertFunc(final_name, params)

        if(data) {
            let basename = path.basename(req.file.key, extname);
            basename += MEDIACONVERT;
            req.file.key = basename + extname;
            next();
        }

        errUtil.createCall(errCode.fail, `영상 업로드 중 오류가 발생되었습니다. 다시 시도해주세요.!`);
        return;
    }
    next();
}





async function convertFunc(final_name,params) {

    // Create a promise on a MediaConvert object
    console.log(JSON.stringify(params));

    // params.Settings.OutputGroups[0].Outputs[0].NameModifier = final_name;
    params.Settings.Inputs[0].FileInput = `${funcUtil.getAWSMediaConvertS3StartingPoint()}${final_name}`;

    // params["OutputGroups"][0]["Outputs"][0]["NameModifier"] = final_name;


    const endpointPromise = new AWS.MediaConvert().createJob(params).promise();

    // Handle promise's fulfilled/rejected status
    endpointPromise.then(
        function(data) {
            console.log("Job created! ", data);
            return data;
        },
        function(err) {
            console.log("Error", err);
        }
    );
}