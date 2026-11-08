How to Run

1. Keep Video_to_VRM.ipynb, video_driver.html and timeline.mjs in the same folder.
2. Open Video_to_VRM.ipynb in your existing OpenCV 4.10 / scikit-learn environment.
3. In the first code cell, change only VIDEO_PATH, EYE_MODEL_PATH and MOUTH_MODEL_PATH. Use the source video and two trained pkl files. Do not use a debug video as input.
4. Run the model and function cells, then run the combined prediction cell.
5. Select these regions in order: the whole head, the left eye on screen, the right eye on screen and the mouth. Include both lips and both mouth corners. Leave some space for the mouth to open. Do not draw the box tightly around the closed lips.
6. In the prediction window, press Space to pause or resume. Press 1, 2 or 3 to select the left eye on screen, the right eye on screen or the mouth again. Changes start on the next frame and do not change saved frames. Press Q to stop early. If head tracking is lost, run the prediction cell again.
7. Results are saved in PROJECT_DIR/expression_runs/<timestamp>/. The folder contains expressions.csv, expressions.json, settings.json and an optional debug.mp4.
8. Run the "3D Playback" cell. In the browser, select .vrm model file, the same source video from Step 3 and expressions.json from this run.
9. Click Play. Use the source video controls at the bottom left to pause or move to another time. Do not use debug.mp4 instead of the source video.
10. If the notebook iframe does not display the page, open the printed browser link.

The server stop cell uses STOP_PREVIEW=False by default. Run All keeps the preview open. To stop it, manually set STOP_PREVIEW=True and run that cell. Restarting the kernel also stops the server.

Scope of the First Version

- The head and body stay fixed. Only left and right eye closure and the aa mouth shape are driven.
- Eyes use SSD matching with the initial templates. If matching fails, they use the global head motion estimate. Each eye is classified independently with HOG + SVM.
- The mouth uses the latest validated method: a fixed ROI in the aligned head frame, with no mouth template search.
- All three regions are processed together from the same video, using the same frame indices and timestamps. The system does not combine eye and mouth CSV files from different people.
- Screen left and right refer to the input video. VRM left and right refer to the avatar's own sides. For a front-facing video without mirroring, the default mapping is screen_left_eye -> blinkRight and screen_right_eye -> blinkLeft. Turn on the swap option for mirrored input. You can also swap the mapping if you want movement on the same side of the screen instead of matching the person's anatomical sides.
- eye closed -> eye closure weight 1, eye open -> 0. mouth open -> aa weight 0.7 by default, mouth closed -> 0.
- unknown -> neutral weight 0. This is a display fallback. It does not mean the classifier identifies an unknown state as open eyes or a closed mouth. The interface and raw data still show unknown.
- crop_valid only means the crop has complete image coverage. It does not prove that the crop contains the whole eye or mouth.
- The current binary classifiers cannot identify five vowel shapes, emotions or the exact mouth opening. The mouth strength of 0.7 is a display setting, not a model estimate.
- Prediction errors also appear on the avatar. A successful slider test only confirms that the avatar expressions work. It does not confirm classifier accuracy.
- Optional smoothing is off by default. When enabled, it uses an exponential transition, alpha=1-exp(-dt/0.05). It only changes the display, not the predictions. It adds a short transition delay. Pausing or seeking applies the target weights directly. This is extra display processing, not a recognition method claimed to come from the course.
- The timestamp frame_index / fps assumes a constant frame rate. Phone videos with a variable frame rate may have sync errors. Prefer the existing constant frame rate test videos.
- This version processes the video offline, then plays it back in sync with the avatar. It does not drive the avatar live from a webcam.

Dependencies and Sources

Existing Python environment: OpenCV, NumPy and scikit-learn to load your trained SVM models. The notebook does not automatically install or upgrade packages.
The browser loads the same fixed versions tested in the previous version: Three.js 0.180.0 and three-vrm 3.4.2. Internet access is required.
The browser reads the VRM, video and JSON through local file selection.
