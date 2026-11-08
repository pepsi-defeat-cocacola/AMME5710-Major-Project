User Guide: Video_to_VRM with Six Mouth States

Files
Video_to_VRM.ipynb: Keeps the original eight cells in the same order. Only the function cell and preview server cell have replacement code. The introduction is updated, and old outputs are cleared.
video_driver_viseme.html: The updated web player.
timeline_viseme.mjs: Handles six-class mouth mapping and time synchronization.
cell_3.py and cell_6.py: Copies of the code for replacing whole cells. Copy the code into the notebook. You do not need to run these py files.
tests.mjs: Node tests that check the mapping logic separately. You do not need to run them on Windows.

Steps
1. Keep the notebook, video_driver_viseme.html and timeline_viseme.mjs in the same working folder.
2. Set the paths in the configuration cell. Make sure MOUTH_MODEL_PATH points to mouth_viseme_hog_svm.pkl from the new training run after correcting the labels.
3. Run the cells in order, starting with the import cell. The model loading cell accepts open/closed for the eyes and closed/a/i/u/e/o for the mouth. The tracking and prediction loop and the CSV/JSON format stay the same.
4. After video processing finishes, run the preview cell. In the browser, select the VRM file, the same source video and the newly generated expressions.json. Do not select an old JSON file or a debug video with a side panel.
5. Smoothing is off by default. After checking the six-class mapping, turn on "Smooth expression changes". Mouth expression strength is 0.7 by default. This slider only changes the display. It does not measure how wide the person opens their mouth.

Mapping
closed: All target weights for aa/ih/ou/ee/oh are 0.
a -> aa, i -> ih, u -> ou, e -> ee, o -> oh.
All five mouth weights are set on every frame. With smoothing on, the old mouth shape fades out as the new one fades in. Seeking or pausing applies the current target weights directly. If a state is unknown, a crop is invalid or head tracking fails, the affected expression channels return to neutral immediately.
The eyes still control blinkLeft/blinkRight independently. For mirrored videos, you can swap the left and right eye mapping.
