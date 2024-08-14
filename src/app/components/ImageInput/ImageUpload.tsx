import Image from "next/image";
import React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onChange: (base64: string | null) => void;
  label: string;
  value?: string | File | null | undefined;
  disabled?: boolean;
  variants?: string;
}

interface SubClasses {
  [key: string]: string;
}

const variants: SubClasses = {
  profile: "rounded-full w-[100px] h-[100px]",
  banner: "rounded-md w-full p h-20",
};

const ImageUpload: React.FC<DropzoneProps> = ({
  onChange,
  label,
  value,
  disabled,
  variants: variantName = "banner",
}) => {
  const [base64, setBase64] = useState(value);

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setBase64(base64String);
        handleChange(base64String);
      };
      reader.readAsDataURL(file);
    },
    [handleChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
  });

  const variantClass = variants[variantName] || "";

  return (
    <div
      {...getRootProps({
        className: `text-white text-center border-2 border-dotted border-neutral-700 ${variantClass}`,
      })}
    >
        <input {...getInputProps()} />
        {base64 ? (
            <Image src={base64 as string} alt={label} layout="fill" objectFit="cover" />
        ) : (
            <p>{label}</p>
        )}
    </div>
  );
};

export default ImageUpload;
