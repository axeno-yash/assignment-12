export const staticReviews = [
    {
        id: "1",
        name: "Sarah M.",
        rating: 5,
        verified: true,
        date: "August 14, 2023",
        comment:
            "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
    },
    {
        id: "2",
        name: "Alex M.",
        rating: 5,
        verified: true,
        date: "August 15, 2023",
        comment:
            "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."
    },
    {
        id: "3",
        name: "Ethan R.",
        rating: 5,
        verified: true,
        date: "August 16, 2023",
        comment:
            "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt."
    },
    {
        id: "4",
        name: "Olivia P.",
        rating: 5,
        verified: true,
        date: "August 17, 2023",
        comment:
            "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out."
    },
    {
        id: "5",
        name: "Liam K.",
        rating: 5,
        verified: true,
        date: "August 18, 2023",
        comment:
            "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion."
    },
    {
        id: "6",
        name: "Ava H.",
        rating: 5,
        verified: true,
        date: "August 19, 2023",
        comment:
            "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter."
    },
    {
        id: "7",
        name: "Daniel W.",
        rating: 4,
        verified: true,
        date: "August 20, 2023",
        comment:
            "Really happy with this purchase. The material feels premium and the fit is exactly what I was looking for. It also arrived nicely packaged and on time."
    },
    {
        id: "8",
        name: "Mia T.",
        rating: 5,
        verified: true,
        date: "August 21, 2023",
        comment:
            "The quality is even better than I expected. The fabric is comfortable, the stitching feels durable, and the design looks great in person. Definitely worth the price."
    },
    {
        id: "9",
        name: "Noah B.",
        rating: 4,
        verified: true,
        date: "August 22, 2023",
        comment:
            "Great everyday piece. I really like the fit and the overall design. After washing it a few times, the fabric still feels good and the colors have held up really well."
    },
    {
        id: "10",
        name: "Emma C.",
        rating: 5,
        verified: true,
        date: "August 23, 2023",
        comment:
            "Absolutely love this! It is comfortable enough to wear all day while still looking stylish. I've already received several compliments and would happily buy from Shop.co again."
    },
    {
        id: "11",
        name: "James L.",
        rating: 4,
        verified: true,
        date: "August 24, 2023",
        comment:
            "The shirt has a clean and modern look that works with almost anything in my wardrobe. The sizing was accurate and the quality feels solid for the price."
    },
    {
        id: "12",
        name: "Sophia N.",
        rating: 5,
        verified: true,
        date: "August 25, 2023",
        comment:
            "One of my favorite purchases recently. The design is simple but stands out, and the fabric is soft without feeling too thin. Everything about it feels thoughtfully made."
    }
];

export const getReviews = (req, res) => {
    try {
        res.status(200).json({
            reviews: staticReviews,
            totalReviews: staticReviews.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
