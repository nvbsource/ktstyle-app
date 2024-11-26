import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from 'antd';

const FaceKYC = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalIdRef = useRef(null); // Sử dụng useRef cho intervalId
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [countdown, setCountdown] = useState(null); // Thời gian đếm ngược
    const countdownRef = useRef(null); // Để theo dõi trạng thái đếm ngược
    const STABILIZATION_THRESHOLD = 10; // Số khung hình cần ổn định
    const stabilizedFramesRef = useRef(0); // Sử dụng useRef để theo dõi số khung hình ổn định
    const [message, setMessage] = useState(""); // Lưu thông báo lỗi
    const previousMessageRef = useRef(""); // Lưu thông báo trước đó
    const [showRetakeButton, setShowRetakeButton] = useState(false);
    const [showContinueButton, setShowContinueButton] = useState(false);


    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // Phát hiện khuôn mặt
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models'); // Phát hiện khuôn mặt
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // Phát hiện khuôn mặt
        }
        loadModels().then(startVideo);

        // Cleanup on component unmount
        return () => {
            clearInterval(intervalIdRef.current);
            stopCamera();
        };
    }, []);

    const updateMessage = (newMessage) => {
        if (previousMessageRef.current !== newMessage) {
            previousMessageRef.current = newMessage;
            setMessage(newMessage);
        }
    };


    const startVideo = () => {
        const constraints = {
            video: {
                facingMode: "user", // Sử dụng camera trước
                width: { ideal: 640 },
                height: { ideal: 480 },
            },
        };

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Trình duyệt của bạn không hỗ trợ camera. Vui lòng sử dụng trình duyệt khác.");
        }


        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch((err) => {
                    console.error("Error accessing camera: ", err);
                });
        } else {
            console.error("getUserMedia is not supported on this browser.");
        }
    };

    const calculateBrightness = (context, width, height) => {
        // Lấy dữ liệu pixel từ canvas
        const imageData = context.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let totalBrightness = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            // Tính độ sáng bằng công thức: (R + G + B) / 3
            const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            totalBrightness += brightness;
        }

        // Độ sáng trung bình
        return totalBrightness / (width * height);
    };

    const areEyesOpen = (landmarks, boundingBox) => {
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        const getEyeHeight = (eye) => {
            const top = eye[1].y; // Điểm trên của mắt
            const bottom = eye[5].y; // Điểm dưới của mắt
            return bottom - top; // Chiều cao mắt
        };

        const leftEyeHeight = getEyeHeight(leftEye);
        const rightEyeHeight = getEyeHeight(rightEye);

        // Sử dụng chiều cao khuôn mặt từ boundingBox
        const faceHeight = boundingBox.height;

        // Tính tỷ lệ chiều cao mắt so với chiều cao khuôn mặt
        const leftEyeRatio = leftEyeHeight / faceHeight;
        const rightEyeRatio = rightEyeHeight / faceHeight;

        const EYE_OPEN_RATIO_THRESHOLD = 0.0402; // Ngưỡng tối thiểu (tỷ lệ)
        console.log({ leftEyeRatio });

        return leftEyeRatio > EYE_OPEN_RATIO_THRESHOLD && rightEyeRatio > EYE_OPEN_RATIO_THRESHOLD;
    };

    const isFaceOccluded = (landmarks) => {
        const mouth = landmarks.getMouth();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        // Kiểm tra nếu không phát hiện đủ điểm
        if (!mouth.length || !leftEye.length || !rightEye.length || !nose.length) {
            return true; // Khuôn mặt bị che
        }

        return false; // Khuôn mặt không bị che
    };

    const isLookingStraight = (landmarks) => {
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        // Lấy tọa độ trung tâm của mắt trái, mắt phải và mũi
        const leftEyeCenter = {
            x: (leftEye[0].x + leftEye[3].x) / 2,
            y: (leftEye[1].y + leftEye[4].y) / 2,
        };

        const rightEyeCenter = {
            x: (rightEye[0].x + rightEye[3].x) / 2,
            y: (rightEye[1].y + rightEye[4].y) / 2,
        };

        const noseCenter = {
            x: nose[0].x,
            y: nose[0].y,
        };

        // Kiểm tra độ cân bằng ngang và dọc giữa mắt và mũi
        const horizontalDifference = Math.abs(leftEyeCenter.y - rightEyeCenter.y);
        const verticalDifference = Math.abs(noseCenter.x - (leftEyeCenter.x + rightEyeCenter.x) / 2);

        const HORIZONTAL_THRESHOLD = 10; // Ngưỡng sai lệch ngang
        const VERTICAL_THRESHOLD = 15; // Ngưỡng sai lệch dọc

        return horizontalDifference < HORIZONTAL_THRESHOLD && verticalDifference < VERTICAL_THRESHOLD;
    };

    const validateFace = (landmarks) => {
        const errors = [];

        // Kiểm tra khuôn mặt có bị che không
        if (isFaceOccluded(landmarks)) {
            errors.push("Khuôn mặt bị che, vui lòng để lộ khuôn mặt!");
        }

        // Kiểm tra khuôn mặt nhìn thẳng
        if (!isLookingStraight(landmarks)) {
            errors.push("Vui lòng nhìn thẳng vào màn hình!");
        }

        return errors;
    };

    const detectFace = async () => {
        if (!videoRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const options = new faceapi.TinyFaceDetectorOptions();

        try {
            const detections = await faceapi
                .detectAllFaces(video, options)
                .withFaceLandmarks();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const borderBox = {
                x: canvas.width * 0.3,
                y: canvas.height * 0.2,
                width: canvas.width * 0.4,
                height: canvas.height * 0.6,
            };

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Lật và vẽ video lên canvas
            context.save();
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            context.restore();

            if (detections.length === 1) {
                const data = detections[0];

                const { box, score } = data.detection || {};
                const landmarks = data.landmarks;
                const isReliable = score > 0.7;
                const MARGIN = 20;

                const isInBorder =
                    box.x >= borderBox.x - MARGIN &&
                    box.y >= borderBox.y - MARGIN &&
                    box.x + box.width <= borderBox.x + borderBox.width + MARGIN &&
                    box.y + box.height <= borderBox.y + borderBox.height + MARGIN;
                // Kiểm tra độ sáng
                const brightness = calculateBrightness(context, canvas.width, canvas.height);
                const BRIGHTNESS_THRESHOLD = 110;
                const isEyesOpen = areEyesOpen(landmarks, box);

                const MIN_FACE_SIZE = 150; // Kích thước khuôn mặt tối thiểu (pixel)
                const MAX_FACE_SIZE = 175; // Kích thước khuôn mặt tối đa (pixel)

                // Thứ tự kiểm tra logic
                if (brightness < BRIGHTNESS_THRESHOLD) {
                    updateMessage("Vui lòng đứng ở nơi có ánh sáng tốt!");
                    stabilizedFramesRef.current = 0;
                } else if (!isInBorder) {
                    updateMessage("Vui lòng đặt khuôn mặt trong khung!");
                    stabilizedFramesRef.current = 0;
                } else if (box.height < MIN_FACE_SIZE) {
                    updateMessage("Nhìn gần hơn!");
                    stabilizedFramesRef.current = 0;
                } else if (box.height > MAX_FACE_SIZE) {
                    updateMessage("Nhìn xa hơn!");
                    stabilizedFramesRef.current = 0;
                } else if (!isReliable) {
                    updateMessage("Nhìn thẳng");
                    stabilizedFramesRef.current = 0;
                } else if (!isEyesOpen) {
                    updateMessage("Không nháy mắt");
                    stabilizedFramesRef.current = 0;
                } else {
                    updateMessage(""); // Không có lỗi
                    stabilizedFramesRef.current = Math.min(
                        stabilizedFramesRef.current + 1,
                        STABILIZATION_THRESHOLD
                    );
                }
            } else if (detections.length === 0) {
                updateMessage("Vui lòng đặt khuôn mặt trong khung!");
                stabilizedFramesRef.current = 0;
            } else {
                setMessage("Phát hiện nhiều khuôn mặt. Vui lòng chỉ để một khuôn mặt!");
                stabilizedFramesRef.current = 0;
            }

            const isStabilized = stabilizedFramesRef.current >= STABILIZATION_THRESHOLD;

            const container = document.querySelector(".camera-container");
            if (container) {
                if (isStabilized) {
                    container.classList.add("stabilized");
                } else {
                    container.classList.remove("stabilized");
                }
            }

            // Vẽ khung
            context.strokeStyle = isStabilized ? "green" : "red";
            context.lineWidth = 3;
            context.strokeRect(
                borderBox.x,
                borderBox.y,
                borderBox.width,
                borderBox.height
            );

            // Reset hoặc chạy đếm ngược
            if (isStabilized && !countdownRef.current) {
                setCountdown(2);
                countdownRef.current = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev === 1) {
                            clearInterval(countdownRef.current);
                            countdownRef.current = null;
                            captureImage();
                        }
                        return prev === 1 ? null : prev - 1;
                    });
                }, 1000);
            } else if (!isStabilized) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
                setCountdown(null);
            }
        } catch (error) {
            console.error("Error detecting face: ", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại!");
            stabilizedFramesRef.current = 0;
        }
    };

    const captureImage = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip the image horizontally while drawing to canvas
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();

        const image = canvas.toDataURL("image/png");
        setCapturedImage(image);

        // Lấy landmarks từ ảnh đã chụp
        const detections = await faceapi.detectSingleFace(canvas).withFaceLandmarks();
        if (detections) {
            const landmarks = detections.landmarks;
            const errors = validateFace(landmarks, detections.detection.box);

            if (errors.length > 0) {
                updateMessage(errors.join(" "));
                setShowRetakeButton(true); // Hiển thị nút "Chụp lại"
                setShowContinueButton(false); // Ẩn nút "Tiếp tục"
            } else {
                updateMessage(""); // Không có lỗi
                setShowRetakeButton(false); // Ẩn nút "Chụp lại"
                setShowContinueButton(true); // Hiển thị nút "Tiếp tục"
            }
        } else {
            updateMessage("Không phát hiện khuôn mặt, vui lòng chụp lại!");
            setShowRetakeButton(true);
            setShowContinueButton(false);
        }

        stopCamera();
    };


    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        const tracks = stream?.getTracks();

        tracks?.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraOn(false);
    };

    const restartCamera = () => {
        setCapturedImage(null);
        setIsCameraOn(true);
        startVideo();

        // Dọn dẹp interval cũ trước khi tạo mới
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }

        // Khởi động lại phát hiện khuôn mặt
        intervalIdRef.current = setInterval(detectFace, 100);
    };

    const sendToServer = () => {
        console.log("Image sent to server: ", capturedImage);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                {isCameraOn && (
                    <div className="camera-container relative flex items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1] rounded-lg"
                            onPlay={() => {
                                if (intervalIdRef.current) {
                                    clearInterval(intervalIdRef.current);
                                }
                                intervalIdRef.current = setInterval(detectFace, 100); // Gọi detectFace mỗi 100ms
                            }}
                        />

                        {/* Canvas */}
                        <canvas
                            ref={canvasRef}
                            className="absolute top-0 left-0 w-full h-full"
                        />

                        {/* Countdown */}
                        {countdown && (
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-4 py-2 rounded-lg">
                                <p className="text-white text-lg font-semibold">
                                    Vui lòng giữ yên {countdown}...
                                </p>
                            </div>
                        )}
                        {message && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                                <p className="text-white text-lg font-semibold text-center p-4">
                                    {message}
                                </p>
                            </div>
                        )}

                    </div>
                )}
                {capturedImage && (
                    <div className="mt-4">
                        <img src={capturedImage} alt="Captured" className="rounded-lg" />
                    </div>
                )}
                <div className="mt-4 space-x-2">
                    {capturedImage ? (
                        <>
                            {showContinueButton && (
                                <Button type="primary" onClick={sendToServer}>
                                    Continue
                                </Button>
                            )}
                            {showRetakeButton && (
                                <Button onClick={restartCamera}>
                                    Retake
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button type="primary" onClick={stopCamera}>
                            Stop Camera
                        </Button>
                    )}
                </div>
            </div>
        </>
    );

};

export default FaceKYC;
