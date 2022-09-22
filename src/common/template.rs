use std::path::PathBuf;

use ractiviti_core::error::{AppError, ErrorCode};
use tokio::fs;
use axum::response::Html;
use ramhorns::{Content, Template};

#[allow(dead_code)]
pub enum HtmlTemplate<'a> {
    Source(&'a str),
    Path(&'a str)
}

impl<'a> HtmlTemplate<'a> {
    pub async fn render<C: Content>(&self, content: &C) -> Result<Html<String>, AppError> {
        let mut source = String::new();
        match self {
            HtmlTemplate::Source(s) => {
                source.push_str(s);
            },
            HtmlTemplate::Path(p) => {
                let srcdir = PathBuf::from(p);
                let srcdir = std::fs::canonicalize(&srcdir)
                    .map_err(|err| {
                        AppError::new(ErrorCode::InternalError, Some(&format!("找不到指定模板文件({})", p)), concat!(file!(), ":", line!()), Some(Box::new(err)))
                    }
                )?;
                let s = fs::read_to_string(p)
                    .await
                    .map_err(|err| {
                        AppError::new(
                            ErrorCode::InternalError, 
                            Some(&format!("文件({}) 读取失败", srcdir.to_str().expect("unexpected error"))), 
                            concat!(file!(), ":", line!()), 
                            Some(Box::new(err))
                        )
                    })?;
                source.push_str(&s);
            },
        }

        let tpl = Template::new(source)
            .map_err(|err| AppError::new(ErrorCode::InternalError, Some("模板解析失败"), concat!(file!(), ":", line!()), Some(Box::new(err))) )?;
        let rst = tpl.render(content);

        Ok(Html(rst))
    }
}

#[cfg(test)] 
mod tests {
    use ramhorns::Content;
    
    use super::*;

    #[derive(Content)]
    pub struct Blog<'a> {
        title: &'a str,
        authors: Vec<Author<'a>>
    }

    #[derive(Content)]
    pub struct Author<'a> {
        name: &'a str,
    }

    #[tokio::test]
    async fn test_render_source() {
        log4rs_macros::prepare_log();

        let blog = Blog {
            title: "abcde",
            authors: vec![ Author{name: "lee"}, Author{name: "evan"} ]
        };
        let source = "{{#title}}<h1>{{title}}</h1>{{/title}}<ul>{{#authors}}<li>{{name}}</li>{{/authors}}</ul>";

        let template = HtmlTemplate::Source(source);
        let rst = template.render(&blog).await.unwrap();
        println!("{}", rst.0);
        assert_eq!("<h1>abcde</h1><ul><li>lee</li><li>evan</li></ul>", rst.0);
    }

    #[tokio::test]
    async fn test_render_path() {
        log4rs_macros::prepare_log();

        let blog = Blog {
            title: "abcde",
            authors: vec![ Author{name: "lee"}, Author{name: "evan"} ]
        };

        let template = HtmlTemplate::Path("./tests_data/blog.html");
        let rst = template.render(&blog).await.unwrap();
        assert_eq!("<h1>abcde</h1><ul><li>lee</li><li>evan</li></ul>", rst.0);
    }
}