package com.firstimpression.backend.Services;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.firstimpression.backend.Exception.ServiceException;
import com.firstimpression.backend.Repository.UsersRepository;
import com.firstimpression.backend.model.Users;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

	private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
			"jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp", "tiff"
	);

	private static final List<String> ALLOWED_DOC_EXTENSIONS = Arrays.asList(
			"pdf", "doc", "docx", "txt"
	);

	private final Cloudinary cloudinary;
	private final UsersRepository usersRepository;
	
	public Map<String, String> uploadImage(MultipartFile file, Users user) throws IOException {
		log.info("Inside FileUploadService - uploadImage(): {}", file != null ? file.getOriginalFilename() : "null");

		if (file == null || file.isEmpty()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Image file cannot be empty.");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename != null && originalFilename.contains(".")) {
			String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
			if (!ALLOWED_EXTENSIONS.contains(extension)) {
				throw new ServiceException(HttpStatus.BAD_REQUEST, "Unsupported image format: ." + extension + ". Supported formats: JPG, PNG, WEBP, HEIC, HEIF, GIF, BMP.");
			}
		}

		Map<String, Object> params = ObjectUtils.asMap(
				"resource_type", "image",
				"public_id", "profile_images/" + user.getId(),
				"overwrite", true,
				"format", "webp"
		);

		Map<String, Object> imageUploadRes = cloudinary.uploader().upload(file.getBytes(), params);

		String imageUrl = imageUploadRes.get("secure_url").toString();
		user.setProfileImageUrl(imageUrl);
		usersRepository.save(user);
		return Map.of("image_url", imageUrl);
	}

	@SuppressWarnings("unchecked")
	public Map<String, String> uploadDocument(MultipartFile file, Users user) throws IOException {
		log.info("Inside FileUploadService - uploadDocument(): {}", file != null ? file.getOriginalFilename() : "null");

		if (file == null || file.isEmpty()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "File cannot be empty.");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename != null && originalFilename.contains(".")) {
			String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
			if (!ALLOWED_DOC_EXTENSIONS.contains(extension)) {
				throw new ServiceException(HttpStatus.BAD_REQUEST, "Unsupported document format: ." + extension + ". Supported formats: PDF, DOC, DOCX.");
			}
		}

		String folder = (user != null && user.getId() != null)
				? "documents/" + user.getId()
				: "documents";

		Map<String, Object> params = ObjectUtils.asMap(
				"resource_type", "auto",
				"folder", folder
		);

		Map<String, Object> uploadRes = cloudinary.uploader().upload(file.getBytes(), params);

		String fileUrl = uploadRes.get("secure_url") != null
				? uploadRes.get("secure_url").toString()
				: uploadRes.get("url").toString();
		String publicId = uploadRes.get("public_id") != null
				? uploadRes.get("public_id").toString()
				: "";

		return Map.of(
				"file_url", fileUrl,
				"url", fileUrl,
				"public_id", publicId,
				"original_filename", originalFilename != null ? originalFilename : ""
		);
	}

	public Map<String, String> uploadDocument(MultipartFile file) throws IOException {
		return uploadDocument(file, null);
	}

	public Map<String, String> uploadFile(MultipartFile file) throws IOException {
		return uploadDocument(file, null);
	}

	public MultipartFile processDocument(MultipartFile file) {
		log.info("Inside FileUploadService - processDocument(): {}", file != null ? file.getOriginalFilename() : "null");

		if (file == null || file.isEmpty()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "File cannot be empty.");
		}

		String originalFilename = file.getOriginalFilename();
		if (originalFilename != null && originalFilename.contains(".")) {
			String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
			if (!ALLOWED_DOC_EXTENSIONS.contains(extension)) {
				throw new ServiceException(HttpStatus.BAD_REQUEST, "Unsupported document format: ." + extension + ". Supported formats: PDF, DOC, DOCX, TXT.");
			}
		}

		return file;
	}
	 
	public void removeImage(Users user) throws IOException {
		log.info("Inside FileUploadService - removeImage() for user: {}", user.getId());
		
		cloudinary.uploader().destroy("profile_images/" + user.getId(), ObjectUtils.asMap("invalidate", true));
		
		user.setProfileImageUrl(null);
		usersRepository.save(user);
	}
	
}

