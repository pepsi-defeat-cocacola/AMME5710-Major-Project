Mouth Recognition Update: Six Mouth Shapes to Three Opening Levels
(Labels were reassigned based on appearance.)

1. Why We Changed It

The original six classes (closed/a/i/u/e/o) had low accuracy. For example,
in train08, frames 0–29 are labeled e and frames 51–61 are labeled i.
Both groups look the same: the mouth is slightly open and a few teeth are
visible. The model cannot learn to tell them apart from these images.
In English, the mouth shapes for i and e, and for u and o, can look very
similar. A single frame may not be enough to tell them apart.

2. The Three New Classes

  closed  Lips are together.                            VRM aa weight: 0
  small   Mouth is slightly open, with a few teeth or   VRM aa weight: 0.4 × mouth expression strength
          a little of the inside of the mouth visible.
          This covers most frames during speech.
  wide    Mouth is wide open, with much of the inside   VRM aa weight: 1.0 × mouth expression strength
          of the mouth or the tongue visible.

We reviewed all 3,538 images frame by frame and reassigned the labels.
We skipped 106 frames that showed transitions or were hard to label.
The new counts are 903 closed, 2,381 small and 148 wide. The original
six-class labels are still in the viseme6_label column of labels.csv.

3. Results

We used leave-one-person-out cross-validation. Each of the 11 people
served as the test person once, and the other 10 were used for training.
Both versions used the same images and the same HOG + SVM method.

  Classes                       Accuracy   Macro-F1   Majority-class baseline accuracy
  Original six (by sound)          48.9%      0.396                            35.9%
  New three (by appearance)        80.4%      0.672                            69.4%

F1 scores for the new classes: closed 0.705, small 0.860 and wide 0.453.
Recall for wide was only 32%. The wide class has 148 images from four people.

Confusion matrix (rows = actual classes, columns = predicted classes,
in the order closed/small/wide):

  [[651  252   0]
   [319 2051  11]
   [  4  105  39]]

We also tried CLAHE (macro-F1 fell to 0.631), majority voting over five
frames (macro-F1 fell to 0.648) and geometric mouth opening features
(no improvement). We did not use these methods in the final version.

These results were calculated on Linux with scikit-image HOG using the
same settings as OpenCV: 64 × 32 image size, 8 × 8 cells, 16 × 16 blocks
and 9 bins. The notebook uses OpenCV on Windows, so its results should be
close but may not match exactly.

4. Files

  mouth_open3_dataset/
    The new dataset. It uses the same format as mouth_viseme_dataset.

  STAGE 3 step2.3 mouth_open3.ipynb
    The training notebook. It loads the data, extracts HOG features, uses
    leave-one-person-out cross-validation to select parameters and saves
    the model.

  Video_to_VRM_open3/
    The updated STAGE 5 VRM player. It supports both six-class and
    three-class models. Only three files changed:

    1. Video_to_VRM.ipynb: load_expression_model now accepts
       closed/small/wide. MOUTH_MODEL_PATH points to the new model.
    2. timeline_viseme.mjs: small and wide both map to aa, with opening
       factors of 0.4 and 1.0, respectively.
    3. tests.mjs: Added tests for the three classes. All tests passed
       when run with node tests.mjs.

5. How to Use It

1. Open the training notebook, set DATASET_ROOT and click Run All.
   Training tests 12 parameter combinations across 11 folds and takes
   about 5–15 minutes.
2. After training, the notebook saves the model to:
   mouth_open3_training_runs/<timestamp>/mouth_open3_hog_svm.pkl
3. In cell 2 of Video_to_VRM_open3/Video_to_VRM.ipynb, update the folder
   in MOUTH_MODEL_PATH to the folder created in the previous step.
4. Follow the original steps to generate expressions.json and play it.
   The suggested mouth expression strength is 1.0.
