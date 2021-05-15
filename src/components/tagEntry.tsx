import { FunctionalComponent, h } from 'preact';

interface TagEntryProps {
    text: string
    icon: string
}

const TagEntry: FunctionalComponent<TagEntryProps> = (props: TagEntryProps) => {
    return (
        <a class="panel-block">
            <span class="panel-icon"><i class={props.icon} aria-hidden="true"></i></span>
            {props.text}
        </a>
    );
};

export default TagEntry;
