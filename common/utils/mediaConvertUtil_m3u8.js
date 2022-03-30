/**
 * Created by gunucklee on 2021. 07. 20.
 */
const AWS = require("aws-sdk");

const path = require('path');
const paramUtil = require('./paramUtil');
const funcUtil = require('./funcUtil');
const sendUtil = require('./sendUtil');
const errUtil = require('./errUtil');
const errCode = require('../define/errCode');

module.exports =  function (file_size, final_name, video_width, video_height) {

    const MEDIACONVERT = 'ConvertSuccess';
    const BITRATE = 1600000;
    const extname = path.extname(final_name);
    console.log('extname: ' + extname);

    if(extname === '.mp4') {
        let bitrate_value = BITRATE;
        if(file_size > 30)
            bitrate_value = BITRATE * ( 30 / file_size );

        if(bitrate_value < 1000000) {
            bitrate_value = 1000000;
        }

        AWS.config.update({
            accessKeyId: funcUtil.getAWSAccessKeyID(),
            secretAccessKey: funcUtil.getAWSSecretAccessKey(),
            region : funcUtil.getAWSRegion(),
        });

        AWS.config.mediaconvert = {endpoint: funcUtil.getAWSMediaConvertEndPoint()}

        console.log("video_width " + video_width)
        console.log("video_height " + video_height)

        const params = {
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
                                    "Container": "RAW"
                                },
                                "VideoDescription": {
                                    "Width": 574,
                                    "Height": 1024,
                                    "CodecSettings": {
                                        "Codec": "FRAME_CAPTURE",
                                        "FrameCaptureSettings": {
                                            "FramerateNumerator": 30,
                                            "FramerateDenominator": 90,
                                            "MaxCaptures": 2,
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
                                "Destination": funcUtil.getAWSMediaConvertS3Destination()
                            }
                        }
                    },
                    {
                        "Name": "Apple HLS",
                        "Outputs": [
                            {
                                "ContainerSettings": {
                                    "Container": "M3U8",
                                    "M3u8Settings": {}
                                },
                                "VideoDescription": {
                                    "CodecSettings": {
                                        "Codec": "H_264",
                                        "H264Settings": {
                                            "ParNumerator": 16,
                                            "HrdBufferInitialFillPercentage": 20,
                                            "HrdBufferSize": 10000000,
                                            "MaxBitrate": bitrate_value,
                                            "ParDenominator": 9,
                                            "RateControlMode": "QVBR",
                                            "SceneChangeDetect": "TRANSITION_DETECTION"
                                        }
                                    }
                                },
                                "AudioDescriptions": [
                                    {
                                        "CodecSettings": {
                                            "Codec": "AAC",
                                            "AacSettings": {
                                                "Bitrate": 96000,
                                                "CodingMode": "CODING_MODE_2_0",
                                                "SampleRate": 48000
                                            }
                                        }
                                    }
                                ],
                                "OutputSettings": {
                                    "HlsSettings": {}
                                },
                                "NameModifier": "ConvertSuccess"
                            }
                        ],
                        "OutputGroupSettings": {
                            "Type": "HLS_GROUP_SETTINGS",
                            "HlsGroupSettings": {
                                "SegmentLength": 2,
                                "Destination": funcUtil.getAWSMediaConvertS3Destination(),
                                "MinSegmentLength": 1,
                                "SegmentControl": "SEGMENTED_FILES"
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
                        "VideoSelector": {
                            "Rotate": "AUTO"
                        },
                        "TimecodeSource": "ZEROBASED",
                        "ImageInserter": {
                            "InsertableImages": [
                                {
                                    "Width": video_width / 6.3,
                                    "Height": video_height / 14.8,
                                    "ImageX": video_width / 1.25,
                                    "ImageY": video_height / 2.8,
                                    "Layer": 1,
                                    "ImageInserterInput": `${funcUtil.getAWSMediaConvertS3StartingPoint()}wegglelogo.png`,
                                    "Opacity": 50
                                }
                            ]
                        },
                        "FileInput": "null"
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

        const paramsRotate = {
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
                                    "Container": "RAW"
                                },
                                "VideoDescription": {
                                    "Width": 574,
                                    "Height": 1024,
                                    "CodecSettings": {
                                        "Codec": "FRAME_CAPTURE",
                                        "FrameCaptureSettings": {
                                            "FramerateNumerator": 30,
                                            "FramerateDenominator": 90,
                                            "MaxCaptures": 2,
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
                                "Destination": funcUtil.getAWSMediaConvertS3Destination()
                            }
                        }
                    },
                    {
                        "Name": "Apple HLS",
                        "Outputs": [
                            {
                                "ContainerSettings": {
                                    "Container": "M3U8",
                                    "M3u8Settings": {}
                                },
                                "VideoDescription": {
                                    "Width": 574,
                                    "Height": 1024,
                                    "CodecSettings": {
                                        "Codec": "H_264",
                                        "H264Settings": {
                                            "ParNumerator": 16,
                                            "HrdBufferInitialFillPercentage": 20,
                                            "HrdBufferSize": 10000000,
                                            "MaxBitrate": bitrate_value,
                                            "ParDenominator": 9,
                                            "RateControlMode": "QVBR",
                                            "SceneChangeDetect": "TRANSITION_DETECTION"
                                        }
                                    }
                                },
                                "AudioDescriptions": [
                                    {
                                        "CodecSettings": {
                                            "Codec": "AAC",
                                            "AacSettings": {
                                                "Bitrate": 96000,
                                                "CodingMode": "CODING_MODE_2_0",
                                                "SampleRate": 48000
                                            }
                                        }
                                    }
                                ],
                                "OutputSettings": {
                                    "HlsSettings": {}
                                },
                                "NameModifier": "ConvertSuccess"
                            }
                        ],
                        "OutputGroupSettings": {
                            "Type": "HLS_GROUP_SETTINGS",
                            "HlsGroupSettings": {
                                "SegmentLength": 2,
                                "Destination": funcUtil.getAWSMediaConvertS3Destination(),
                                "MinSegmentLength": 1,
                                "SegmentControl": "SEGMENTED_FILES"
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
                        "VideoSelector": {
                            "Rotate": "AUTO"
                        },
                        "TimecodeSource": "ZEROBASED",
                        "ImageInserter": {
                            "InsertableImages": [
                                {
                                    "Width": video_width / 6.3,
                                    "Height": video_height / 14.8,
                                    "ImageX": video_width / 1.25,
                                    "ImageY": video_height / 2.8,
                                    "Layer": 1,
                                    "ImageInserterInput": `${funcUtil.getAWSMediaConvertS3StartingPoint()}wegglelogo.png`,
                                    "Opacity": 50
                                }
                            ]
                        },
                        "FileInput": "null"
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

        console.log("asdiajdoqwijdqowij: " + final_name)
        const data = convertFunc(final_name, (video_width > video_height) ? paramsRotate : params);

        if(data) {
            let basename = path.basename(final_name, extname);
            basename += MEDIACONVERT;
            final_name = basename + extname;
            return final_name;
        }
        errUtil.createCall(errCode.fail, `영상 업로드 중 오류가 발생되었습니다. 다시 시도해주세요.!`);
        return;
    }
    return final_name;
}





async function convertFunc(final_name,convertParams) {

    convertParams.Settings.Inputs[0].FileInput = `${funcUtil.getAWSMediaConvertS3StartingPoint()}${final_name}`;

    const endpointPromise = new AWS.MediaConvert().createJob(convertParams).promise();

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