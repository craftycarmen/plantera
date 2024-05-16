import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGuide, editGuide } from "../../../store/guides";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import ErrorHandling from "../../ErrorHandling";

function GuideForm({ guide, formType }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const guideId = guide.id;
    const sessionUser = useSelector(state => state.session.user)
    const [title, setTitle] = useState(guide?.title || "");
    const [image, setImage] = useState("")
    const [description, setDescription] = useState(guide?.description || "");
    const [content, setContent] = useState(guide?.content || "");
    const [errors, setErrors] = useState({});
    const [imageLoading, setImageLoading] = useState(false);

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }, { 'indent': '-1' }, { 'indent': '+1' }],
                // ["link", "image"],
                ["link"],
                ["clean"]
            ],
            // handlers: {
            //     'image': handleImageUpload
            // }
        }
    }

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "link",
        // "image"
    ]

    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImage(file)
    }

    const createGuide = formType === 'Create Guide';
    const updateGuide = formType === 'Update Guide';

    useEffect(() => {
        const errs = {};

        if (!title) errs.title = '';
        if (!description) errs.description = '';
        if (createGuide && !image) errs.image = '';
        if (!content) errs.content = '';
        if (title && title.trim().length < 5 || title.trim().length > 30) errs.title = 'Title must be between 5-30 characters';
        if (description && description.trim().length < 20 || description.trim().length > 75) errs.description = 'Description must be between 20-75 characters';
        if (content && content.trim().length < 250 || content.trim().length > 5000) errs.content = 'Content must be between 250-5,000 characters';

        setErrors(errs);
    }, [title, description, image, content, createGuide])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        guide = {
            ...guide,
            userId: sessionUser.id,
            title,
            description,
            content,
            image
        }

        if (createGuide) {
            try {
                setImageLoading(true)
                const newGuide = await dispatch(addGuide(guide))

                const { id } = newGuide;

                navigate(`/guides/${id}`)
            } catch (error) {
                console.error('Error creating guide:', error);
                setImageLoading(false);
            }
        } else if (updateGuide) {
            try {
                await dispatch(editGuide(guide));

                navigate(`/guides/${guideId}`)
            } catch (error) {
                console.error('Error updating guide:', error);
            }
        }
    }

    return (
        <>
            <h1>{formType}</h1>
            {!sessionUser ? (
                <ErrorHandling />
            ) : (
                <form onSubmit={handleSubmit} className="guideForm">
                    <div className="inputContainer">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder=""
                            id="title"
                            style={{ width: "578px" }}
                        />
                        <label htmlFor="title" className="floating-label">Title*</label>
                        <div className="error">{errors.title &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.title}</>}</div>
                    </div>
                    {createGuide &&
                        <>
                            <div className='inputContainer'>
                                <input
                                    type="file"
                                    onChange={updateFile}
                                    accept=".jpg, .jpeg, .png"
                                    id='image'
                                    style={{ width: "578px" }}
                                />
                                <label htmlFor='image' className='floating-label'>Cover Image*</label>
                            </div>
                            <div className='error'>{errors.image &&
                                <><i className="fa-solid fa-circle-exclamation" /> {errors.image}</>}</div>
                        </>}
                    <div className="inputContainer">
                        <textarea
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder=""
                            id="description"
                            style={{ width: "578px", height: "40px" }}
                        />
                        <label htmlFor="description" className="floating-label">Description*</label>
                        <div className="error">{errors?.description &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.description}</>}</div>
                    </div>
                    <div className="inputContainer">
                        <div>Content*</div>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                        />

                        <div className="error">{errors?.content &&
                            <><i className="fa-solid fa-circle-exclamation" /> {errors.content}</>}</div>
                    </div>
                    {imageLoading && (<div style={{ marginLeft: "290px", marginTop: "20px" }} className="dots"></div>)}
                    <div>
                        <button style={{ marginTop: "15px", width: "600px" }}
                            disabled={Object.values(errors).length}
                            type="submit">{formType}</button>
                    </div>
                </form >
            )}
        </>
    )
}

export default GuideForm;
