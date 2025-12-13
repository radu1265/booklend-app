package com.example.booklend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCreateDto {
	@NotBlank
	private String title;

	@NotBlank
	private String author;

	private String genre;

	private String summary;

	@NotNull
	@Min(0)
	private Integer stockCount;
}
