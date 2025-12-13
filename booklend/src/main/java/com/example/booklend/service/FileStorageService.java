package com.example.booklend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

	@Value("${file.upload-dir:uploads}")
	private String uploadDir;

	private Path rootLocation;

	@PostConstruct
	public void init() {
		this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
		try {
			Files.createDirectories(rootLocation);
		} catch (IOException e) {
			throw new RuntimeException("Could not create upload directory", e);
		}
	}

	public String store(MultipartFile file) throws IOException {
		String original = StringUtils.cleanPath(file.getOriginalFilename());
		String ext = "";
		int idx = original.lastIndexOf('.');
		if (idx != -1) ext = original.substring(idx);
		String filename = UUID.randomUUID().toString() + ext;
		Path target = rootLocation.resolve(filename);
		Files.copy(file.getInputStream(), target);
		return filename;
	}

	public Resource loadAsResource(String filename) {
		try {
			Path file = rootLocation.resolve(filename).normalize();
			Resource resource = new UrlResource(file.toUri());
			if (resource.exists() && resource.isReadable()) return resource;
			else return null;
		} catch (MalformedURLException e) {
			return null;
		}
	}

	public void delete(String filename) {
		if (filename == null) return;
		try {
			Path file = rootLocation.resolve(filename).normalize();
			Files.deleteIfExists(file);
		} catch (IOException ignored) {}
	}
}
