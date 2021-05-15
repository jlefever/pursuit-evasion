import { h, Fragment } from 'preact';

import "./style.css";

export interface Tag {
    text: string;
    class: string;
}

export interface Entry {
    id: number;
    text: string;
    icon: string;
    tags?: Tag[];
}

export interface RichListProps {
    entries: Entry[];
    onClick: (id: number) => void;
}

function RichList(props: RichListProps) {
    return <>
        {props.entries.map(e =>
            <label key={e.id} class="panel-block">
                <span class="panel-icon">
                    <i class={e.icon} aria-hidden="true"></i>
                </span>
                <a href="#" class="mr-3" onClick={_ => props.onClick(e.id)}>{e.text}</a>
                <div class="tags">
                    {e.tags && e.tags.map(t =>
                        <span class={`tag ${t.class}`}>{t.text}</span>
                    )}
                </div>
            </label>)}
    </>;
};

export default RichList;
