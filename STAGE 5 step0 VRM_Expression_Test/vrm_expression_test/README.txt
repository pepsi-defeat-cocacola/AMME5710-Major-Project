VRM Expression Test — Stage 5

1. Open Anaconda Prompt or PowerShell in that folder and run:
   python start_viewer.py
2. When the browser opens, select your local .vrm file.
3. Test the left eye, right eye and mouth sliders. Click "Reset all" when finished.
4. If the avatar faces away from you, click "Back view" to view it from the other side, or drag with the mouse to rotate the view.
5. Press Ctrl+C to stop the Python server.

No pip installation is needed. The browser needs internet access to cdn.jsdelivr.net to load the external libraries.
The browser reads the VRM file locally. The code has no model upload interface.
Left and right refer to the avatar's own sides. They appear reversed when you view the avatar from the front.
This program only tests expressions. It does not include optical flow, classification or CSV playback.
The current open/closed mouth predictions will only drive aa when connected later. The five mouth shapes are available here to test the model.

Dependencies outside the course:
Three.js 0.180.0: https://github.com/mrdoob/three.js
three-vrm 3.4.2: https://github.com/pixiv/three-vrm
Official example reference:
https://github.com/pixiv/three-vrm/tree/dev/packages/three-vrm/examples
