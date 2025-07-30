'use client'

import { useState, useEffect } from 'react';

export default function FilterSideBar() {
    const categories: string[] = [
        "Kitchen & Dining",
        "Home Decor",
        "Art & Collectibles",
        "Jewelry",
        "Clothing",
        "Toys & Games"
    ]

    interface Rating {
        star: string,
        rating: number
    }

    const ratings = [
        {
            star: "5",
            rating: 5
        },
        {
            star: "4",
            rating: 4
        },
        {
            star: "3",
            rating: 3
        },
        {
            star: "2",
            rating: 2
        },
        {
            star: "1",
            rating: 1
        },
    ]

    const min = 0
    const max = 1000

    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);

    function minSlide(e: any) {
        const value = Math.min(parseInt(e.target.value), maxValue)
        setMinValue(value)
    }

    function maxSlide(e: any) {
        const value = Math.max(parseInt(e.target.value), minValue)
        setMaxValue(value)
    }

    const percent1 = (minValue / max) * 100;
    const percent2 = (maxValue / max) * 100;

    const sliderTrackBackground =
        `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;


    const [categoryCheckbox, setCategoryCheckbox] = useState<string[]>([]);
    function toggleCategoryCheckbox(category: string) {
        setCategoryCheckbox(previousState =>
            previousState.includes(category) ?
                previousState.filter(item => item !== category) :
                [...previousState, category])
    }

    const [ratingCheckbox, setRatingCheckbox] = useState<Rating[]>([]);
    function toggleRatingCheckbox(rating: Rating) {
        setRatingCheckbox(previousState =>
            previousState.includes(rating) ?
                previousState.filter(item => item !== rating) :
                [...previousState, rating])
    }

    function reset() {
        setMinValue(min)
        setMaxValue(max)
        setCategoryCheckbox([])
        setRatingCheckbox([])
    }
    return (
        <form>
            <h5>Filters</h5>
            <div>
                <h5>Category</h5>
                {categories.map((category) => (
                    <label htmlFor={category} key={category + "labelkey"}>
                        <input
                            type="checkbox"
                            id={category}
                            name={category}
                            value={category}
                            key={category + "inputkey"}
                            onChange={() => toggleCategoryCheckbox(category)} />
                        {category}
                    </label>
                ))}
            </div>
            <div>
                <h5>Price Range</h5>
                <div className="relative w-4/5 h-24">
                    <div style={{ background: sliderTrackBackground }} className="w-full h-4 relative">
                        <input type="range"
                            className="w-full absolute bg-transparent pointer-events-none cursor-pointer inputTypeRange"
                            id="sliderOne"
                            min={min}
                            max={max}
                            value={minValue}
                            onInput={minSlide} />
                        <input type="range"
                            className="w-full absolute bg-transparent pointer-events-none cursor-pointer inputTypeRange"
                            id="sliderTwo"
                            min={min}
                            max={max}
                            value={maxValue}
                            onInput={maxSlide} />
                    </div>
                </div>
            </div>
            <input type="number"
                id="inputOne"
                min={min}
                max={max}
                value={minValue}
                onInput={minSlide} />
            <input type="number"
                id="inputTwo"
                min={min}
                max={max}
                value={maxValue}
                onInput={maxSlide} />
            <div>
                <h5>Customer Rating</h5>
                {ratings.map((rating) => (
                    <label htmlFor={rating.star + "star"} key={rating.star + "labelkey"}>
                        <input
                            type="checkbox"
                            id={rating.star + "star"}
                            name={rating.star + "star"}
                            value={rating.rating}
                            key={rating.star + "inputkey"}
                            onChange={() => toggleRatingCheckbox(rating)} />
                        {rating.star}
                    </label>
                ))}
            </div>
            <input type="reset" value="Clear All Filters" onClick={reset} />
        </form>
    )
}