'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import axios from "axios";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import Button from "@/app/components/products/Button";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import firebaseApp from "@/libs/firebase";

export type ImageType = {
    color: string;
    colorCode: string;
    image: File | null
}

export type UploadedImageType = {
    color: string;
    colorCode: string;
    image: string;
}

const AddProductForm = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<ImageType[] | null>();
    const [isProductCreated, setIsProductCreated] = useState(false);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();

    useEffect(() => {
        setCustomValue('images', images);
    }, [images]);

    useEffect(() => {
        if (isProductCreated) {
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);

        let uploadedImages: UploadedImageType[] = [];

        if (!data.category) {
            setIsLoading(false);
            return toast.error('Category is not selected');
        }

        if (!data.images || data.images.length === 0) {
            setIsLoading(false);
            return toast.error('No selected image');
        }

        const handleImageUploads = async () => {
            toast('Creating a product, please wait...');
            try {
                const uploadPromises: Promise<void>[] = [];

                for (const item of data.images) {
                    if (item.image) {
                        const fileName = new Date().getTime() + '-' + item.image.name;
                        const storage = getStorage(firebaseApp);
                        const storageRef = ref(storage, `products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef, item.image);

                        uploadPromises.push(new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload is ' + progress + '% done');
                                    switch (snapshot.state) {
                                        case 'paused':
                                            console.log('Upload is paused');
                                            break;
                                        case 'running':
                                            console.log('Upload is running');
                                            break;
                                    }
                                },
                                (error) => {
                                    console.log('Error uploading image', error);
                                    reject(error);
                                },
                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref)
                                        .then((downloadURL) => {
                                            uploadedImages.push({
                                                ...item,
                                                image: downloadURL
                                            });
                                            resolve();
                                        })
                                        .catch((error) => {
                                            reject(error);
                                        });
                                }
                            );
                        }));
                    }
                }

                await Promise.all(uploadPromises);
            } catch (error) {
                setIsLoading(false);
                console.log('Error handling image uploads', error);
                toast.error("Error handling image uploads");
            }
        };

        await handleImageUploads();

        const productData = { ...data, images: uploadedImages };

        axios.post('/api/product', productData)
            .then(() => {
                toast.success("Product created");
                setIsProductCreated(true);
                router.refresh();
            })
            .catch((error) => {
                toast.error("Something went wrong when saving product to db");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const category = watch('category');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const addImageToState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if (!prev) {
                return [value];
            }
            return [...prev, value];
        });
    }, []);

    const removeImageFromState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if (prev) {
                const filteredImages = prev.filter((item) => item.color !== value.color);
                return filteredImages;
            }
            return prev;
        });
    }, []);

    return (
        <>
            <Heading title="Add a Product" center />
            <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="price"
                label="Price"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                required
            />
            <Input
                id="brand"
                label="Brand"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <TextArea
                id="description"
                label="Description"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <CustomCheckbox
                id="inStock"
                register={register}
                label="This Product is in stock"
            />
            <div className="w-full font-medium">
                <div className="mb-2 font-semibold">Select a category</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                    {categories.map((item) => {
                        if (item.label === 'All') {
                            return null;
                        }
                        return (
                            <div key={item.label} className="col-span">
                                <CategoryInput
                                    onClick={(category) => setCustomValue('category', category)}
                                    selected={category === item.label}
                                    label={item.label}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold">
                        Select the available product colors and upload their images.
                    </div>
                    <div className="text-sm">
                        You must upload an image for each of the color selected otherwise your color selection will be ignored.
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {colors.map((item, index) => (
                        <SelectColor
                            key={index}
                            item={item}
                            addImageToState={addImageToState}
                            removeImageFromState={removeImageFromState}
                            isProductCreated={isProductCreated}
                        />
                    ))}
                </div>
            </div>
            <Button
                label={isLoading ? 'Loading...' : 'Add Product'}
                onClick={handleSubmit(onSubmit)}
            />
        </>
    );
}

export default AddProductForm;
