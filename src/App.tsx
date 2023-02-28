import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as camera from "@mediapipe/camera_utils";

const App = (): JSX.Element => {
	const webCamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const sizes = {
		width: 640,
		height: 480
	};

	let video: any = null;

	function onResults(results: any) {
		if (canvasRef.current?.width) {
			canvasRef.current.width = sizes.width;
		}

		if (canvasRef.current?.height) {
			canvasRef.current.height = sizes.height;
		}

		const ctx = canvasRef.current?.getContext("2d");

		if (typeof ctx !== "undefined" && ctx !== null && results.multiFaceLandmarks.length) {
			ctx.save();

			ctx.clearRect(0, 0, sizes.width, sizes.height);

			ctx.translate(sizes.width, 0);
			ctx.scale(-1, 1);

			ctx.drawImage(results.image, 0, 0, sizes.width, sizes.height);

			const points = results.multiFaceLandmarks[0];

			const xEye =
				((points[226].x + points[133].x + points[145].x + points[159].x) / 4) * sizes.width;
			const yEye =
				((points[226].y + points[133].y + points[145].y + points[159].y) / 4) *
				sizes.height;

			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
			ctx.arc(xEye, yEye, 10, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	useEffect(() => {
		const faceMesh = new FaceMesh({
			locateFile: (file: any) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
			}
		});

		faceMesh.setOptions({
			maxNumFaces: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5
		});

		faceMesh.onResults(onResults);

		if (
			typeof webCamRef.current !== "undefined" &&
			webCamRef.current !== null &&
			webCamRef.current.video !== null
		) {
			video = new camera.Camera(webCamRef.current.video, {
				onFrame: async () => {
					await faceMesh.send({ image: webCamRef.current?.video });
				},
				width: sizes.width,
				height: sizes.height
			});

			video.start();
		}
	}, []);

	return (
		<div style={{ margin: 0, backgroundColor: "#333333" }}>
			<Webcam
				ref={webCamRef}
				mirrored
				style={{
					position: "absolute",
					marginLeft: "auto",
					marginRight: "auto",
					left: 0,
					right: 0,
					textAlign: "center",
					zIndex: 9,
					width: sizes.width,
					height: sizes.height
				}}
			/>

			<canvas
				ref={canvasRef}
				style={{
					position: "absolute",
					marginLeft: "auto",
					marginRight: "auto",
					left: 0,
					right: 0,
					textAlign: "center",
					zIndex: 9,
					width: sizes.width,
					height: sizes.height
				}}
			/>
		</div>
	);
};

export default App;
