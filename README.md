# Alzheimer MRI Disease Detection using EfficientNetB0

Proyek ini bertujuan untuk mendeteksi stadium penyakit Alzheimer melalui citra MRI otak menggunakan arsitektur **EfficientNetB0**. Model dikembangkan dengan teknik *transfer learning* untuk melakukan klasifikasi otomatis ke dalam empat kategori medis.

## 📊 Dataset Overview
Dataset yang digunakan berisi citra MRI hasil augmentasi yang dikategorikan menjadi 4 kelas:
* **Mild Demented**: Demensia Ringan
* **Moderate Demented**: Demensia Sedang
* **Non Demented**: Kondisi Normal
* **Very Mild Demented**: Demensia Sangat Ringan

**Detail Dataset:**
* **Total Citra**: 33,984 file
* **Input Size**: 224x224 piksel
* **Split**: 80% Training (27,188 citra) dan 20% Validation (6,796 citra)

## 🧠 Model Architecture
Model dibangun menggunakan **TensorFlow/Keras** dengan spesifikasi:
* **Base Model**: EfficientNetB0 (Pre-trained on ImageNet)
* **Freeze Weights**: Layer dasar dibekukan agar pelatihan lebih ringan
* **Custom Layers**: GlobalAveragePooling2D, Dropout (0.2), dan Dense Layer (Softmax)
* **Optimizer**: Adam
* **Loss Function**: Sparse Categorical Crossentropy

## 📈 Performance
Hasil pelatihan selama 5 epoch menunjukkan:
* **Final Training Accuracy**: 62.09%
* **Final Validation Accuracy**: 67.02%
* **Validation Loss**: 0.7465
